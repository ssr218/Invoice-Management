const prisma = require('../utils/prismaClient');

exports.createInvoice = async (req, res) => {
    try {
        const { invoiceNumber, customerName, invoiceAmount, invoiceDate, status } = req.body;

        // Validation
        if (!invoiceNumber || !customerName || !invoiceAmount || !invoiceDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const amount = parseFloat(invoiceAmount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'invoiceAmount must be greater than 0' });
        }

        const validStatuses = ['PAID', 'UNPAID'];
        const invoiceStatus = status || 'UNPAID';
        if (!validStatuses.includes(invoiceStatus)) {
            return res.status(400).json({ message: 'Invalid status. Must be PAID or UNPAID' });
        }

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                customerName,
                invoiceAmount: amount,
                invoiceDate: new Date(invoiceDate),
                status: invoiceStatus
            }
        });
        res.status(201).json(invoice);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Invoice number already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const { status, startDate, endDate, search } = req.query;

        const where = {};

        if (status) {
            where.status = status;
        }

        if (startDate || endDate) {
            where.invoiceDate = {};
            if (startDate) where.invoiceDate.gte = new Date(startDate);
            if (endDate) where.invoiceDate.lte = new Date(endDate);
        }

        if (search) {
            where.OR = [
                { invoiceNumber: { contains: search } },
                { customerName: { contains: search } }
            ];
        }

        const invoices = await prisma.invoice.findMany({ where });

        // Aggregates for Dashboard
        const allInvoices = await prisma.invoice.findMany();
        const totalCount = allInvoices.length;
        // Calculate total amount from all invoices or filtered? Requirement says "Dashboard" usually needs global stats, 
        // but the API is /invoices. The previous implementation returned global stats with the list. 
        // I will keep it as global stats to satisfy dashboard requirements without extra API calls.
        const totalAmount = allInvoices.reduce((acc, inv) => acc + inv.invoiceAmount, 0);
        const totalPaid = allInvoices.filter(inv => inv.status === 'PAID').reduce((acc, inv) => acc + inv.invoiceAmount, 0);
        const totalUnpaid = allInvoices.filter(inv => inv.status === 'UNPAID').reduce((acc, inv) => acc + inv.invoiceAmount, 0);

        res.json({
            invoices,
            totalCount,
            totalAmount,
            totalPaid,
            totalUnpaid
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const { invoiceNumber, customerName, invoiceAmount, invoiceDate, status } = req.body;

        const data = {};
        if (invoiceNumber) data.invoiceNumber = invoiceNumber;
        if (customerName) data.customerName = customerName;
        if (invoiceDate) data.invoiceDate = new Date(invoiceDate);

        if (invoiceAmount !== undefined) {
            const amount = parseFloat(invoiceAmount);
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: 'invoiceAmount must be greater than 0' });
            }
            data.invoiceAmount = amount;
        }

        if (status) {
            const validStatuses = ['PAID', 'UNPAID'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status. Must be PAID or UNPAID' });
            }
            data.status = status;
        }

        const invoice = await prisma.invoice.update({
            where: { id: parseInt(req.params.id) },
            data
        });
        res.json(invoice);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(400).json({ message: error.message });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        await prisma.invoice.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Invoice deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(400).json({ message: error.message });
    }
};
