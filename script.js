document.getElementById("signup-button").addEventListener("click", async function() {
    const emailInput = document.getElementById("email-field").value;
    if (emailInput) {
        try {
            const response = await fetch('/api/saveEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailInput }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Thank you for signing up! We will keep you updated at ${emailInput}.`);
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert("An error occurred while saving your email. Please try again later.");
        }
    } else {
        alert("Please enter a valid email address.");
    }
});
