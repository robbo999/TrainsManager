import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'yorkcontrol' && password === 'railsafe123') {
      localStorage.setItem('authenticated', 'true');
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
     <div className="min-h-screen bg-[#0d1117] text-white flex flex-col justify-center items-center p-6">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold">Stranded Trains Manager – By LR</h1>
      <p className="text-gray-400 mt-2">Track, manage and resolve rail incidents efficiently.</p>
    </div>
          
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-xs">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded bg-[#161b22] border border-gray-600 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-[#161b22] border border-gray-600 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-yellow-500 text-black font-semibold w-full py-2 rounded hover:bg-yellow-600"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
