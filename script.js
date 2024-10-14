document.getElementById("submit-button").addEventListener("click", function() {
    const userInput = document.getElementById("assistant-type").value;
    document.getElementById("main-container").style.display = "none";
    document.getElementById("coming-soon-container").style.display = "block";
    document.getElementById("coming-soon-message").innerHTML = `Thank you! We are considering your idea: "${userInput}". Coming Soon. We're cookin' somethin' special!`;
});

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
