import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InvoiceList from './pages/InvoiceList';
import InvoiceForm from './pages/InvoiceForm';
import ProtectedRoute from './routes/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import './styles.css';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/invoices"
                        element={
                            <ProtectedRoute>
                                <InvoiceList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/invoices/new"
                        element={
                            <ProtectedRoute>
                                <InvoiceForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/invoices/edit/:id"
                        element={
                            <ProtectedRoute>
                                <InvoiceForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
