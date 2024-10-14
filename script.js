document.getElementById("submit-button").addEventListener("click", function() {
    const userInput = document.getElementById("assistant-type").value;

    if (userInput.trim() !== "") {
        // Hide the main container and show the coming soon container
        document.getElementById("main-container").style.display = "none";
        document.getElementById("coming-soon-container").style.display = "block";
        document.getElementById("coming-soon-message").innerHTML = `Thank you for your input! We're cooking something cool. Sign up for early access!`;
    } else {
        alert("Please enter a description for your ideal assistant.");
    }
});

document.getElementById("signup-button").addEventListener("click", async function() {
    const emailInput = document.getElementById("email-field").value;

    if (emailInput.trim() !== "") {
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
                alert(`Thank you for signing up! We'll keep you in the loop at ${emailInput}.`);
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
