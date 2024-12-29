const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// Validation function
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Validate input
        const validationErrors = validateForm(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                success: false,
                errors: validationErrors 
            });
        }

        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db('botsmann');
        
        const { name, email, message } = req.body;
        
        // Save to database
        const submission = await db.collection('consultations').insertOne({
            name,
            email,
            message,
            createdAt: new Date()
        });

        // Send notification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: 'New Consultation Request - Botsmann',
            html: `
                <h2>New Consultation Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Received on: ${new Date().toLocaleString()}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Send confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Botsmann',
            html: `
                <h2>Thank you for reaching out!</h2>
                <p>Dear ${name},</p>
                <p>We've received your consultation request and will get back to you shortly.</p>
                <p>Your message:</p>
                <blockquote>${message}</blockquote>
                <p>Best regards,<br>The Botsmann Team</p>
            `
        };

        await transporter.sendMail(userMailOptions);

        await client.close();

        res.status(200).json({ 
            success: true,
            message: 'Submission successful' 
        });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error submitting form',
            error: error.message 
        });
    }
}