import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatINR } from '../utils/format';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalCount: 0, totalAmount: 0, totalPaid: 0, totalUnpaid: 0 });
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/invoices');
                setStats({
                    totalCount: response.data.totalCount,
                    totalAmount: response.data.totalAmount,
                    totalPaid: response.data.totalPaid,
                    totalUnpaid: response.data.totalUnpaid
                });
                const sorted = response.data.invoices.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
                setRecentInvoices(sorted.slice(0, 5));
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <nav className="top-nav">
                <span className="nav-brand">Internal Finance Dashboard</span>
                <div className="flex-gap">
                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline"
                        style={{ border: '1px solid var(--border-color)', padding: '6px 10px', background: 'transparent' }}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ border: 'none', background: 'transparent' }}>Logout</button>
                </div>
            </nav>

            <div className="layout-container">
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ marginBottom: '8px' }}>Invoices</h1>
                    <div className="finance-summary">
                        <span style={{ marginRight: '24px' }}>Total Count: <span className="finance-value">{stats.totalCount}</span></span>
                        <span style={{ marginRight: '24px' }}>Total Receivables: <span className="finance-value">{formatINR(stats.totalAmount)}</span></span>
                        <span style={{ marginRight: '24px' }}>Paid: <span className="finance-value" style={{ color: 'var(--status-paid)' }}>{formatINR(stats.totalPaid)}</span></span>
                        <span>Unpaid: <span className="finance-value" style={{ color: 'var(--status-unpaid)' }}>{formatINR(stats.totalUnpaid)}</span></span>
                    </div>
                </div>

                <div className="card">
                    <div className="flex-between" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
                        <h3>Recent Activity</h3>
                        <Link to="/invoices/new" className="btn btn-primary">Create Invoice</Link>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>Invoice ID</th>
                                <th style={{ width: '30%' }}>Customer</th>
                                <th style={{ width: '15%' }}>Date</th>
                                <th style={{ width: '20%' }}>Amount</th>
                                <th style={{ width: '15%' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading data...</td></tr>
                            ) : recentInvoices.length > 0 ? recentInvoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{inv.invoiceNumber}</td>
                                    <td>{inv.customerName}</td>
                                    <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                                    <td style={{ fontFamily: 'monospace' }}>{formatINR(inv.invoiceAmount)}</td>
                                    <td>
                                        <span className={inv.status === 'PAID' ? 'status-paid' : 'status-unpaid'}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No invoices found.</td></tr>
                            )}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Link to="/invoices" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none' }}>View All Invoices &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
