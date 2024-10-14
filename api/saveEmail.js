import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        try {
            await client.connect();
            const database = client.db('botsmann');
            const emails = database.collection('emails');
            await emails.insertOne({ email });
            res.status(200).json({ message: 'Email saved successfully' });
        } catch (error) {
            console.error('Error saving email:', error);
            res.status(500).json({ error: 'Failed to save email' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
