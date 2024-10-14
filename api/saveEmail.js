import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default async function handler(req, res) {
    console.log('Handler triggered'); // Debugging log

    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            console.error('No email provided');
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        try {
            console.log('Connecting to MongoDB...');
            const client = await clientPromise;
            const database = client.db('botsmann');
            const emails = database.collection('emails');

            console.log('Inserting email:', email);
            await emails.insertOne({ email });

            console.log('Email saved successfully');
            res.status(200).json({ message: 'Email saved successfully' });
        } catch (error) {
            console.error('Error saving email:', error);
            res.status(500).json({ error: 'Failed to save email' });
        }
    } else {
        console.error('Invalid method');
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
