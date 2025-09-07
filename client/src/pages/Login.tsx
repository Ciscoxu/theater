// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const validInviteCode = '123456'; // 示例邀请码，可替换为后端验证

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    const stored = localStorage.getItem(`user_${username}`);
    if (!stored) return setError('用户不存在');
    const parsed = JSON.parse(stored);
    if (parsed.password !== password) return setError('密码错误');
    localStorage.setItem('currentUser', username);
    navigate('/characters');
  };

  const handleRegister = () => {
    if (inviteCode !== validInviteCode) return setError('邀请码无效');
    if (!username || !password) return setError('请填写账号和密码');
    if (localStorage.getItem(`user_${username}`)) return setError('用户名已存在');

    localStorage.setItem(`user_${username}`, JSON.stringify({ password }));
    localStorage.setItem('currentUser', username);
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: 'cover',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        width: '320px',
        textAlign: 'center',
      }}>
        <h2>{isRegistering ? '注册' : '登录'}</h2>

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="邀请码"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              style={inputStyle}
            />
            
            <input
            type="text"
            placeholder="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={inputStyle}
            />
          </>

          
        )}

        <input
          type="text"
          placeholder="账号"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          onClick={isRegistering ? handleRegister : handleLogin}
          style={buttonStyle}
        >
          {isRegistering ? '注册并进入' : '登录'}
        </button>

        <p style={{ marginTop: '12px' }}>
          {isRegistering ? '已有账号？' : '还没注册？'}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={{ marginLeft: '6px', color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isRegistering ? '去登录' : '去注册'}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid #ccc',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#8B3A2F',
  color: '#fff',
  fontSize: '1rem',
  cursor: 'pointer',
};
