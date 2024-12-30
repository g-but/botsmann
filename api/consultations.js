const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = connection;
    return connection;
}

// Create consultation schema
const consultationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Only create model if it doesn't exist
const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();

        const { name, email, message } = req.body;

        // Validate fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Save to MongoDB
        const consultation = new Consultation({ name, email, message });
        await consultation.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: 'New Consultation Request',
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
Time: ${new Date().toLocaleString()}
            `,
        };

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        return res.status(201).json({
            success: true,
            message: 'Consultation request received successfully'
        });

    } catch (error) {
        console.error('Request failed:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
};