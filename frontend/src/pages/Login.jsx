import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                <button
                    onClick={toggleTheme}
                    className="btn btn-outline"
                    style={{ border: '1px solid var(--border-color)', padding: '6px 10px', background: 'var(--bg-surface)' }}
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            <div className="login-box">
                <h2 style={{ marginBottom: '24px', fontSize: '18px' }}>Internal Finance Portal</h2>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>

                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        Unauthorized access is prohibited.
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-subtle)', textAlign: 'center' }}>
                        (Demo: admin@example.com / admin123)
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
