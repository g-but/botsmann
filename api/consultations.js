const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const rateLimit = require('express-rate-limit');
const xss = require('xss');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});

const ConsultationSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    ip: String
});

const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        limiter(req, res, async () => {
            const { name, email, message } = req.body;
            
            if (!name || !email || !message) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const sanitizedData = {
                name: xss(name),
                email: xss(email),
                message: xss(message),
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            };

            await mongoose.connect(process.env.MONGODB_URI);
            
            const consultation = new Consultation(sanitizedData);
            await consultation.save();

            await Promise.all([
                transporter.sendMail({
                    to: email,
                    subject: 'Thanks for contacting Botsmann',
                    html: `
                        <h2>Hello ${sanitizedData.name},</h2>
                        <p>We've received your message and will respond within 24 hours.</p>
                        <p>Best regards,<br>Botsmann Team</p>
                    `
                }),
                transporter.sendMail({
                    to: process.env.EMAIL_TO,
                    subject: 'New Botsmann Consultation Request',
                    html: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${sanitizedData.name}</p>
                        <p><strong>Email:</strong> ${sanitizedData.email}</p>
                        <p><strong>Message:</strong> ${sanitizedData.message}</p>
                        <p><strong>IP:</strong> ${sanitizedData.ip}</p>
                    `
                })
            ]);

            res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};