const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log environment variables (only for debugging purposes, do not log sensitive data in production)
console.log('Environment Variables:', {
    MONGODB_URI: process.env.MONGODB_URI,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_TO: process.env.EMAIL_TO,
});

// MongoDB connection
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);

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
        console.error('Email transporter configuration failed:', error);
    } else {
        console.log('Email transporter is configured and ready to send emails');
    }
});

// API endpoint for form submission
app.post('/api/consultations', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        console.log('Incoming request:', { name, email, message });

        // Validate fields
        if (!name || !email || !message) {
            console.log('Validation failed: Missing fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Save to MongoDB
        console.log('Attempting to save consultation to MongoDB...');
        const consultation = new Consultation({ name, email, message });
        await consultation.save();
        console.log('Consultation saved to MongoDB:', consultation);

        // Send email
        console.log('Attempting to send email...');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: 'New Consultation Request',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send email',
                });
            }
            console.log('Email sent successfully:', info.response);
            res.status(201).json({
                success: true,
                message: 'Consultation request received successfully',
            });
        });
    } catch (error) {
        console.error('Error in API endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
