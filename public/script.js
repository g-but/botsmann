document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultationForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const button = form.querySelector('button');
        const spinner = button.querySelector('.spinner');
        const buttonText = button.querySelector('span');
        
        buttonText.style.opacity = '0';
        spinner.style.display = 'block';
        button.disabled = true;

        try {
            const formData = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            };

            const response = await fetch('/api/consultations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = '/thank-you.html';
            }, 500);

        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
            
            buttonText.style.opacity = '1';
            spinner.style.display = 'none';
            button.disabled = false;
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        document.querySelector('.hero').style.transform = `translateY(${scroll * 0.5}px)`;
    });
});