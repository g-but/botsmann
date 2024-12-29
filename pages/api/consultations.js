import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const consultationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

let Consultation;

try {
    Consultation = mongoose.model('Consultation');
} catch {
    Consultation = mongoose.model('Consultation', consultationSchema);
}

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            await connectToDatabase();

            const consultation = new Consultation({ name, email, message });
            await consultation.save();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: 'New Consultation Request',
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(201).json({ success: true, message: 'Consultation request received successfully' });
        } catch (error) {
            console.error('Error in API:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
}
