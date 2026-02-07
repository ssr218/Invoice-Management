import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatINR } from '../utils/format';
import { useTheme } from '../context/ThemeContext';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/invoices?${params.toString()}`);
            setInvoices(response.data.invoices);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete record?')) {
            try {
                await api.delete(`/invoices/${id}`);
                fetchInvoices();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <nav className="top-nav">
                <div className="flex-gap">
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>&larr; Back</Link>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <span className="nav-brand">All Reports</span>
                </div>
                <div className="flex-gap">
                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline"
                        style={{ border: '1px solid var(--border-color)', padding: '6px 10px', background: 'transparent' }}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <Link to="/invoices/new" className="btn btn-primary">New Entry</Link>
                </div>
            </nav>

            <div className="layout-container">
                <div className="card" style={{ marginBottom: '16px', background: 'var(--table-header-bg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label>Status</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label>From</label>
                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                        </div>
                        <div style={{ flex: 1, minWidth: '140px' }}>
                            <label>To</label>
                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                        </div>
                        <div style={{ flex: 2, minWidth: '200px' }}>
                            <label>Search</label>
                            <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search records..." />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>Ref #</th>
                                <th style={{ width: '25%' }}>Client Entity</th>
                                <th style={{ width: '15%' }}>Date</th>
                                <th style={{ width: '15%' }}>Amount</th>
                                <th style={{ width: '10%' }}>Status</th>
                                <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading...</td></tr>
                            ) : invoices.length > 0 ? invoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{inv.invoiceNumber}</td>
                                    <td>{inv.customerName}</td>
                                    <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                                    <td style={{ fontFamily: 'monospace' }}>{formatINR(inv.invoiceAmount)}</td>
                                    <td>
                                        <span className={inv.status === 'PAID' ? 'status-paid' : 'status-unpaid'}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Link to={`/invoices/edit/${inv.id}`} className="btn btn-outline" style={{ border: 'none', background: 'transparent', padding: '4px 8px' }}>Edit</Link>
                                        <button onClick={() => handleDelete(inv.id)} className="btn btn-outline" style={{ border: 'none', background: 'transparent', padding: '4px 8px', color: 'var(--danger)' }}>Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoiceList;
