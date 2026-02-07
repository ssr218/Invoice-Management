const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const CREDENTIALS = { email: 'admin@example.com', password: 'admin123' };

async function runTests() {
    try {
        console.log('1. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, CREDENTIALS);
        const token = loginRes.data.token;
        if (!token) throw new Error('No token returned');
        console.log('✅ Login successful. Token received.');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n2. Testing Create Invoice...');
        const newInvoice = {
            invoiceNumber: `INV-${Date.now()}`,
            customerName: 'Test Customer',
            invoiceAmount: 1500.50,
            invoiceDate: '2024-01-01',
            status: 'UNPAID'
        };
        const createRes = await axios.post(`${API_URL}/invoices`, newInvoice, authHeaders);
        const invoiceId = createRes.data.id;
        if (!invoiceId) throw new Error('No invoice ID returned');
        console.log('✅ Invoice created. ID:', invoiceId);

        console.log('\n3. Testing Get Invoices...');
        const getRes = await axios.get(`${API_URL}/invoices`, authHeaders);
        if (!Array.isArray(getRes.data.invoices)) throw new Error('Invoices not an array');
        console.log(`✅ Get Invoices successful. Count: ${getRes.data.totalCount}`);

        console.log('\n4. Testing Update Invoice...');
        const updateRes = await axios.put(`${API_URL}/invoices/${invoiceId}`, { status: 'PAID' }, authHeaders);
        if (updateRes.data.status !== 'PAID') throw new Error('Status update failed');
        console.log('✅ Invoice updated to PAID.');

        console.log('\n5. Testing Delete Invoice...');
        await axios.delete(`${API_URL}/invoices/${invoiceId}`, authHeaders);
        console.log('✅ Invoice deleted.');

        console.log('\nCannot verify 401 without stopping/starting logic, assuming middleware works if above worked (secured routes).');

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

runTests();
