// pages/Chat.tsx — Silicon Valley “Twelfth Night” style
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// —— Utility helpers ——
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

const bubbleShadow = '0 6px 18px rgba(0,0,0,0.18)';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, image, image2, desc, traits, background } = (location.state as any) || {
    name: 'Harper Ellis',
    image: '/default.jpg',
    image2: '/default_chat.jpg',
    desc: '',
    traits: '',
    background: ''
  };

  // —— auth gate ——
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) navigate('/');
  }, [navigate]);

  const storageKey = useMemo(() => `chat_history_${name}`, [name]);
  const loadMessages = (): { role: string; content: string }[] => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const persistMessages = (msgs: { role: string; content: string }[]) =>
    localStorage.setItem(storageKey, JSON.stringify(msgs));

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);


  // —— generate script ——
  const handleGenerateScript = () => {
    // 1) 组织一个用于生成剧本的 seedPrompt（你也可以在 Script 页里再拼装）
    const seedPrompt = `以舞台剧剧本格式生成一段剧情开场：
    角色名：${name}
    角色头像：${image}
    人物设定：${desc}
    性格特征：${traits}
    背景故事：${background}
    要求：以对话为主，加入舞台指示（灯光/音效/走位），中文，长度约 100 字。`;
    // 2) 将当前会话上下文一并传给剧本页
    const context = { name, image, image2, desc, traits, background, seedPrompt, history: messages };
    // 3) 导航到剧本页，由剧本页负责“立即开始”生成
    navigate('/script', { state: context });
    };

  // —— send ——
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const sys = {
      role: 'system',
      content: `你现在是一个名为「${name}」的角色。你是：${desc}。你性格是：${traits}。背景是：${background}。请完全以该角色风格进行回答，不要跳出角色。`
    };

    const base = [...messages, { role: 'user', content: text }];
    setMessages(base);
    setInput('');
    setLoading(true);

    persistMessages(base);

    try {
      // Prefer a server-side proxy in production. Front-end keys are visible to users.
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ⚠️ In production, route via your backend (e.g., /api/chat) and keep the key server-side.
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          temperature: 0.9,
          stream: true,
          messages: [sys, ...messages, { role: 'user', content: text }]
        })
      });

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let acc = '';

      // Insert a streaming placeholder
      setMessages((prev) => [...prev, { role: 'streaming', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.trim().startsWith('data: '));
        for (const line of lines) {
          const json = line.replace(/^data: /, '').trim();
          if (json === '[DONE]') continue;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((prev) => {
                const copy = [...prev];
                if (copy[copy.length - 1]?.role === 'streaming')
                  copy[copy.length - 1] = { role: 'streaming', content: acc };
                return copy;
              });
            }
          } catch {}
        }
      }

      // finalize
      setMessages((prev) => {
        const finalMsgs = [...prev.slice(0, -1), { role: 'assistant', content: acc }];
        persistMessages(finalMsgs);
        return finalMsgs;
      });
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '出错了，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  // —— rendering ——
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: "url('/chatback.jpg')", // stage/curtain background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
      {/* character plate (left) */}
      <div
        style={{
          position: 'absolute',
          left: 350,
          bottom: 100,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 16
        }}
      >
        <div
          style={{
            width: 600,
            height:700,
            background: 'transparent',
            borderRadius: 18,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <img
            src={image2}
            alt={name}
            style={{ width: 600, height: 700, objectFit: 'contain', filter: 'drop-shadow(0 14px 24px rgba(0,0,0,.35))' }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,   // 图片容器下面 40px
            left:-10,
            width: '100%',
            textAlign: 'left',
            color: 'cyan',
            fontWeight: 700,
            fontSize: 24,
            fontStyle: 'italic',
            transform: 'skewX(-10deg)',
            textShadow: '0 2px 8px rgba(66, 54, 54, 0.5)'
          }}
        >
          {name}
        </div>
      </div>

      {/* floating chat card (right) */}
      <div
        style={{
          position: 'absolute',
          right: 200,
          top: 120,
          width: 800,
          background: '#F6EAD9',
          borderRadius: 16,
          boxShadow: '0 18px 32px rgba(0,0,0,.25)',
          border: '1px solid rgba(0,0,0,.06)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* header */}
        <div
          style={{
            padding: '14px 18px',
            fontWeight: 700,
            fontSize: 14,
            color: '#7A5B3A',
            borderBottom: '1px solid rgba(0,0,0,.06)'
          }}
        >
          Conversation with {name}
        </div>

        {/* messages area */}
        <div
          style={{
            height: 440,
            padding: 16,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          {messages
            .filter((m) => m.role !== 'system')
            .map((m, i) => {
              const isUser = m.role === 'user';
              const isStream = m.role === 'streaming';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 10 }}>
                  {!isUser && (
                    <img
                      src={image}
                      alt="avatar"
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', boxShadow: bubbleShadow }}
                    />
                  )}

                  <div
                    style={{
                      maxWidth: 280,
                      background: isUser ? '#FFFFFF' : '#FFF9F2',
                      color: '#3a2b1c',
                      padding: '10px 12px',
                      borderRadius: 12,
                      boxShadow: bubbleShadow,
                      border: '1px solid rgba(0,0,0,.05)'
                    }}
                  >
                    <div style={{ fontSize: 13, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                      {m.content}
                      {isStream && <span className="cursor">▋</span>}
                    </div>
                  </div>

                  {isUser && (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#DCC3A4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#705437',
                        boxShadow: bubbleShadow
                      }}
                      aria-label="user initials"
                    >
                      {getInitials(localStorage.getItem('currentUser') || 'KW')}
                    </div>
                  )}
                </div>
              );
            })}

          {loading && (
            <div style={{ alignSelf: 'center', fontSize: 12, color: '#8a6b47' }}>对方正在思考中…</div>
          )}
        </div>

        {/* input row */}
        <div style={{ padding: 12, borderTop: '1px solid rgba(0,0,0,.06)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,.08)',
              borderRadius: 999,
              padding: '8px 10px',
              boxShadow: 'inset 0 1px 0 rgba(0,0,0,.03)'
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Say something to the character…"
              style={{
                flex: 1,
                outline: 'none',
                border: 'none',
                background: 'transparent',
                fontSize: 14
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              aria-label="send"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#d0c3af' : '#E2C69C',
                boxShadow: bubbleShadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* paper-plane arrow */}
              <img
                src="/send.jpg"   // 👉 把文件放到 public 目录下并改名，比如 telegram-icon.png
                alt="send"
                style={{ width: 30, height: 30 }}
              />
            </button>

            {/* 新增的生成剧本按钮 */}
            <button
              onClick={handleGenerateScript} // 👉 你需要实现这个函数
              aria-label="generate-script"
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                background: '#C9E2FF',
                color: '#2A4B7C',
                fontWeight: 600,
                boxShadow: bubbleShadow,
                fontSize: 14
              }}
            >
              Generate Script
            </button>
                    </div>
        </div>
      </div>

      {/* top-left badge placeholder */}
      <img
        src="/logo.jpg"
        alt="badge"
        style={{ position: 'absolute', left: 16, top: 10, width: 250, height: 'auto', opacity: 0.95}}
        onError={(e) => ((e.currentTarget.style.display = 'none'))}
      />
    </div>
  );
}
