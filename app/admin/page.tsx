'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'spirit2024') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="glass-panel admin-login animate-breathe">
            <div className="admin-icon-wrapper">
                <Lock size={32} />
            </div>

            <h1 className="admin-title">Admin Access</h1>
            <p className="admin-subtitle">Enter credentials to manage SoulJourney content</p>

            <form onSubmit={handleLogin} className="admin-form">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="admin-input"
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="admin-input"
                        required
                    />
                </div>

                {error && <p className="admin-error">{error}</p>}

                <button
                    type="submit"
                    className="admin-btn-primary"
                >
                    Enter Sanctum
                </button>
            </form>
        </div>
    );
}
