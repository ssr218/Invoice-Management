const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const invoiceRoutes = require('./routes/invoice.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/', (req, res) => {
    res.send('Invoice Management System API');
});

module.exports = app;
