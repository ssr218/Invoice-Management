import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const InvoiceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [saving, setSaving] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const [formData, setFormData] = useState({
        invoiceNumber: '',
        customerName: '',
        invoiceAmount: '',
        invoiceDate: '',
        status: 'UNPAID'
    });

    useEffect(() => {
        if (isEdit) {
            const fetchInvoice = async () => {
                try {
                    const response = await api.get(`/invoices/${id}`);
                    const inv = response.data;
                    setFormData({
                        invoiceNumber: inv.invoiceNumber,
                        customerName: inv.customerName,
                        invoiceAmount: inv.invoiceAmount,
                        invoiceDate: inv.invoiceDate.split('T')[0],
                        status: inv.status
                    });
                } catch (err) {
                    console.error(err);
                }
            };
            fetchInvoice();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await api.put(`/invoices/${id}`, formData);
            } else {
                await api.post('/invoices', formData);
            }
            navigate('/invoices');
        } catch (err) {
            alert('Error saving record.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <nav className="top-nav">
                <div className="flex-gap">
                    <Link to="/invoices" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>&larr; Cancel</Link>
                    <span style={{ color: 'var(--border-color)' }}>|</span>
                    <span className="nav-brand">{isEdit ? 'Edit Record' : 'New Entry'}</span>
                </div>
                <button
                    onClick={toggleTheme}
                    className="btn btn-outline"
                    style={{ border: '1px solid var(--border-color)', padding: '6px 10px', background: 'transparent' }}
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </nav>

            <div className="layout-container" style={{ maxWidth: '600px', marginTop: '20px' }}>
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Invoice ID Number</label>
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                required
                                placeholder="e.g. INV-2024-001"
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Client / Company Name</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>Date of Issue</label>
                                <input
                                    type="date"
                                    name="invoiceDate"
                                    value={formData.invoiceDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Total Amount (INR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="invoiceAmount"
                                    value={formData.invoiceAmount}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Payment Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                            </select>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
