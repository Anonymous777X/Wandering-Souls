'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Credentials are verified on the server; a signed, httpOnly session
            // cookie is what actually unlocks the dashboard and the write APIs.
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                router.replace('/admin/dashboard');
                router.refresh();
                return;
            }

            const data = await res.json().catch(() => null);
            setError(data?.error || 'Invalid credentials');
        } catch {
            setError('Could not reach the server. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                        autoComplete="username"
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
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error && <p className="admin-error">{error}</p>}

                <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Verifying...' : 'Enter Sanctum'}
                </button>
            </form>
        </div>
    );
}
