import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail]       = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/register', { username, email, password });
      navigate('/login');
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{ marginTop: '1rem' }}>Sign Up</button>
      </form>
    </div>
  );
}
