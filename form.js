async function validateFormClient(formData) {
    const errors = [];
    
    if (formData.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (formData.message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    return errors;
}

async function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('formStatus');
    
    // Clear previous status messages
    statusDiv.innerHTML = '';
    
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
    };

    // Client-side validation
    const validationErrors = await validateFormClient(formData);
    if (validationErrors.length > 0) {
        statusDiv.innerHTML = `
            <div style="color: #dc3545; margin-top: 16px; padding: 12px;">
                ${validationErrors.map(err => `• ${err}`).join('<br>')}
            </div>
        `;
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span class="spinner"></span>
        Sending...
    `;
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            // Success
            statusDiv.innerHTML = `
                <div style="color: #10a37f; margin-top: 16px; padding: 12px; background: #e6f7f3; border-radius: 6px;">
                    <p style="margin: 0;">Thank you! Your message has been sent successfully.</p>
                    <p style="margin: 8px 0 0;">We'll get back to you at ${formData.email} soon.</p>
                </div>
            `;
            form.reset();
        } else {
            throw new Error(result.errors ? result.errors.join(', ') : result.message);
        }
    } catch (error) {
        statusDiv.innerHTML = `
            <div style="color: #dc3545; margin-top: 16px; padding: 12px; background: #fdf1f1; border-radius: 6px;">
                <p style="margin: 0;">Error: ${error.message}</p>
                <p style="margin: 8px 0 0;">Please try again or contact us directly.</p>
            </div>
        `;
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    }
}