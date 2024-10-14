document.getElementById("submit-button").addEventListener("click", function() {
    const userInput = document.getElementById("assistant-type").value;
    document.getElementById("main-container").style.display = "none";
    document.getElementById("coming-soon-container").style.display = "block";
    document.getElementById("coming-soon-message").innerHTML = `Thank you! We are considering your idea: "${userInput}". Coming Soon. We're cookin' somethin' special!`;
});

document.getElementById("signup-button").addEventListener("click", function() {
    const emailInput = document.getElementById("email-field").value;
    if (emailInput) {
        alert(`Thank you for signing up! We will keep you updated at ${emailInput}.`);
        // Here you would typically send the email to your server for further processing.
    } else {
        alert("Please enter a valid email address.");
    }
});
