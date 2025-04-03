const API_KEY = "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"

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    // Display user message
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="message user">${userInput}</div>`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userInput }]
        })
    });

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Display bot response
    chatBox.innerHTML += `<div class="message bot">${botMessage}</div>`;
    document.getElementById("user-input").value = ""; // Clear input
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll down
}
