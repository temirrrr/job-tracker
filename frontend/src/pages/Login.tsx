import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      const { data } = await API.post<{ access_token: string }>('/token', params);
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch {
      alert('Ошибка входа');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{ marginTop: '1rem' }}>Sign In</button>
      </form>
    </div>
  );
}
