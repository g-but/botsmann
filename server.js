const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
console.log('Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

// Create consultation schema
const consultationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Consultation = mongoose.model('Consultation', consultationSchema);

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Test email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration failed:', error);
    } else {
        console.log('Email configuration successful');
    }
});

// API endpoint for form submission
app.post('/api/consultations', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        console.log('Received submission:', { name, email, message });

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
        console.log('Saved to MongoDB:', consultation);

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
                    console.error('Email sending failed:', error);
                    reject(error);
                } else {
                    console.log('Email sent:', info.response);
                    resolve(info);
                }
            });
        });

        res.status(201).json({
            success: true,
            message: 'Consultation request received successfully'
        });

    } catch (error) {
        console.error('Request failed:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});