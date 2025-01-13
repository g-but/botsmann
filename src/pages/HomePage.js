import React from 'react';
import ContactForm from '../components/ContactForm';

const HomePage = () => {
    return (
        <div>
            <section className="hero">
                <h1>AI Solutions for Human Progress</h1>
                <p>Transforming industries through advanced robotics and artificial intelligence</p>
                <button id="contactUsButton">Contact Us</button>
            </section>
            <ContactForm title="Contact Us" />
        </div>
    );
};

export default HomePage;
