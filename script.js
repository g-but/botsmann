document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.getElementById("assistant-type");
    const submitButton = document.getElementById("submit-button");

    submitButton.addEventListener("click", async function() {
        const userInput = inputField.value.trim();
        if (userInput === "") {
            alert("Please describe your ideal AI assistant to proceed.");
            return;
        }

        try {
            const response = await fetch("/api/chatgpt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: userInput }),
            });

            const data = await response.json();
            alert(`ChatGPT suggests: ${data.response}`);
        } catch (error) {
            alert("Error connecting to the server. Please try again later.");
        }
    });
});
