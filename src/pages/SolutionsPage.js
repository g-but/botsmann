import React from 'react';
import ContactForm from '../components/ContactForm';

const SolutionsPage = () => {
    return (
        <div>
            <section className="hero">
                <h1>Our Solutions</h1>
                <p>We offer highly customized AI personal assistants for any need. Our solutions are designed to help you achieve your goals, improve your productivity, and unleash your creativity.</p>
                <button id="contactUsButton">Contact Us</button>
            </section>
            <ContactForm title="Contact Us" />
        </div>
    );
};

export default SolutionsPage;
