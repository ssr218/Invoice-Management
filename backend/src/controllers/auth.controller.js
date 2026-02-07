const jwt = require('jsonwebtoken');

// Hardcoded credentials as per instructions
const HARDCODED_USER = {
    email: 'admin@example.com',
    password: 'admin123'
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
        const token = jwt.sign(
            { email: HARDCODED_USER.email, id: 1 },
            process.env.JWT_SECRET || 'junior_dev_secret_123',
            { expiresIn: '24h' }
        );
        return res.json({ token, user: { email: HARDCODED_USER.email } });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
};
