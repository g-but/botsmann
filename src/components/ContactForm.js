import React, { useState } from 'react';

const ContactForm = ({ title }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [formStatus, setFormStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormStatus('Sending...');

        const formData = {
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        };

        try {
            const response = await fetch('/api/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('Message sent successfully!');
            } else {
                setFormStatus(data.error || 'An error occurred');
            }
        } catch (error) {
            setFormStatus('Failed to send message. Please try again.');
        }
    };

    return (
        <section className="contact-form">
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
            <div id="formStatus">{formStatus}</div>
        </section>
    );
};

export default ContactForm;
