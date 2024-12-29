// script.js

function showPrompt(solutionType) {
    const promptSection = document.getElementById('promptContent');
    let promptText = '';

    switch(solutionType) {
        case 'personal':
            promptText = "Unlock the potential of AI for your personal life. Get personalized solutions to enhance your day-to-day tasks. Enter your email to get started:";
            break;
        case 'professional':
            promptText = "Discover how AI can transform your professional workflow. Let's craft solutions that drive productivity. Enter your email to learn more:";
            break;
        case 'business':
            promptText = "Elevate your business with automation and robotics. We tailor AI solutions for your unique business needs. Enter your email to see how we can help:";
            break;
        default:
            promptText = "Enter your email to discover our solutions.";
    }

    promptSection.innerHTML = `
        <p>${promptText}</p>
        <input type="email" placeholder="Your email address" id="emailInput">
        <button type="submit" onclick="submitEmail()">Get Started</button>
    `;
}

function submitEmail() {
    const email = document.getElementById('emailInput').value;
    if (validateEmail(email)) {
        alert("Thank you! We'll be in touch soon.");
        // Here you could add your email submission logic (e.g., sending to a server)
    } else {
        alert("Please enter a valid email address.");
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
