export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        try {
            // Log the email to console for now (you would eventually replace this with a database call)
            console.log('Received email:', email);
            res.status(200).json({ message: 'Email saved successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

