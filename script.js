document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.getElementById("assistant-type");
    const submitButton = document.getElementById("submit-button");

    // Event listener for button click
    submitButton.addEventListener("click", function() {
        const inputValue = inputField.value.trim();
        if (inputValue === "") {
            alert("Please describe your ideal AI assistant to proceed.");
        } else {
            alert(`Thank you for your input! You described: "${inputValue}"`);
            // TODO: Add logic here to handle form submission, e.g., send to server
        }
    });
});
