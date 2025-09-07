// pages/Script.tsx — Stage panel preview + editable mode
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// —— Helpers ——
const bubbleShadow = '0 10px 24px rgba(0,0,0,.18)';

// Try to extract "Speaker: line" style; treat [stage] / （舞台） as stage directions
function parseScript(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((raw) => {
    // Stage directions
    if (/^[\(（\[]|^【/.test(raw)) {
      return { type: 'stage', text: raw.replace(/^[-•\s]*/, '') } as const;
    }
    // Speaker: line
    const m = raw.match(/^([A-Za-z\u4e00-\u9fa5][A-Za-z\u4e00-\u9fa5\s]{0,20})\s*[:：]\s*(.*)$/);
    if (m) return { type: 'line', speaker: m[1].trim(), text: m[2] } as const;
    // Narration
    return { type: 'narration', text: raw } as const;
  });
}

function initials(name: string) {
  return (name || 'NA')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
}

export default function ScriptPage() {
  const { state } = useLocation() as any;
  const { name, image, image2, desc, traits, background, seedPrompt, history = [] } = state || {};

  const [content, setContent] = useState(''); // streaming content
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [draft, setDraft] = useState(''); // editable text after generated
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const sys = useMemo(
    () => ({
      role: 'system',
      content:
        `你是舞台剧编剧助手，请用舞台剧脚本格式输出。` +
        `角色名：${name}；设定：${desc}；性格：${traits}；背景：${background}。` +
        `格式建议：\n` +
        `舞台指示用【】或（）；台词用“角色名：内容”。`
    }),
    [name, desc, traits, background]
  );

  // ——— Start streaming on mount ———
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            temperature: 0.8,
            stream: true,
            messages: [sys, ...history, { role: 'user', content: seedPrompt || '请基于角色信息生成一个开场剧本。' }],
          }),
        });

        const reader = resp.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let acc = '';

        while (reader && !cancelled) {
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
                setContent(acc);
              }
            } catch {}
          }
        }

        // finished -> enable edit with current content
        setDraft((d) => (d || acc));
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const blocks = useMemo(() => parseScript(mode === 'edit' ? draft : content), [content, draft, mode]);

  const backgroundUrl = state?.backgroundUrl || '/chatback.jpg';

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 24,
      }}
    >
      {/* Center Panel */}
      <div
        style={{
          width: 960,
          maxWidth: '90vw',
          height: 620,
          margin: '40px auto',
          background: '#F6EAD9',
          borderRadius: 20,
          boxShadow: '0 30px 60px rgba(0,0,0,.3)',
          border: '1px solid rgba(0,0,0,.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(0,0,0,.06)',
          }}
        >
          <div style={{ fontWeight: 800, color: '#7A5B3A' }}>script · {name || '角色'}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMode((m) => (m === 'preview' ? 'edit' : 'preview'))}
              disabled={loading}
              style={{
                height: 32,
                padding: '0 12px',
                borderRadius: 999,
                border: '1px solid rgba(0,0,0,.08)',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {mode === 'preview' ? 'edit' : 'back to preview'}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(mode === 'edit' ? draft : content)}
              style={{ height: 32, padding: '0 12px', borderRadius: 999, border: '1px solid rgba(0,0,0,.08)', background: '#fff', cursor: 'pointer' }}
            >copy script</button>
            <button
              onClick={() => {
                const blob = new Blob([(mode === 'edit' ? draft : content) || ''], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `${name || 'script'}.txt`; a.click(); URL.revokeObjectURL(url);
              }}
              style={{ height: 32, padding: '0 12px', borderRadius: 999, border: '1px solid rgba(0,0,0,.08)', background: '#fff', cursor: 'pointer' }}
            >download</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'edit' ? (
            <textarea
              ref={editorRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%',
                minHeight: 520,
                resize: 'vertical',
                border: '1px solid rgba(0,0,0,.12)',
                borderRadius: 12,
                padding: 14,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 14,
                lineHeight: 1.6,
                background: '#fff',
                boxShadow: 'inset 0 1px 0 rgba(0,0,0,.03)'
              }}
              placeholder={loading ? 'generating…' : 'edit your script here（download formart .txt）'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {blocks.length === 0 && (
                <div style={{ alignSelf: 'center', color: '#7A5B3A' }}>
                  {loading ? 'generating…' : 'no content'}
                </div>
              )}

              {blocks.map((b: any, idx: number) => {
                if (b.type === 'stage') {
                  return (
                    <div key={idx} style={{ alignSelf: 'center', fontStyle: 'italic', opacity: .8, background: '#FFF7E9', padding: '8px 12px', borderRadius: 12, border: '1px dashed rgba(0,0,0,.1)' }}>
                      {b.text}
                    </div>
                  );
                }
                if (b.type === 'narration') {
                  return (
                    <div key={idx} style={{ alignSelf: 'center', maxWidth: 680, textAlign: 'center', background: '#FFFFFF', border: '1px solid rgba(0,0,0,.06)', borderRadius: 12, padding: '10px 12px', boxShadow: bubbleShadow }}>
                      {b.text}
                    </div>
                  );
                }
                // line
                const isMain = name && b.speaker && b.speaker.includes(name);
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: isMain ? 'flex-start' : 'flex-end', gap: 10 }}>
                    {isMain && (
                      <img src={image || image2} alt={b.speaker} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', boxShadow: bubbleShadow }} />
                    )}
                    <div style={{ maxWidth: 680, background: '#FFFFFF', color: '#3a2b1c', padding: '10px 12px', borderRadius: 12, boxShadow: bubbleShadow, border: '1px solid rgba(0,0,0,.05)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, opacity: .8 }}>{b.speaker || '旁白'}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{b.text}</div>
                    </div>
                    {!isMain && (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#DCC3A4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#705437', boxShadow: bubbleShadow }}>
                        {initials(b.speaker || 'T')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
