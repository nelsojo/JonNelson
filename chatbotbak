// Function to decode Base64
function decodeBase64(encodedString) {
    return atob(encodedString);  // atob is the built-in JavaScript function to decode Base64
}

// Use the encoded API key from config.js
// Assuming config.js is loaded before chatbot.js and contains the `encodedApiKey`
const encodedApiKey = "c2stcHJvai1WSVhfUnJ5bEw4ZW5ZbHFTNnFndzBmNjYyNVl1YVZIS3FIbHhwR05uM2tfc24taTlfMGhtWVRicUhkZnpZT3N6dUo4N2NsV09BMVQzQmxia0ZKd2s5ajBqQ0VUUDMtR19kdjlRRnNDZ052THZHR1RrN2EyYUlPY19DM2hTSjVDai1kWXRzeDlzRkVLdVBoWXQzSThWd3JTRzdVSUE=";

// Decode the Base64 API key
const API_KEY = decodeBase64(encodedApiKey);

// Now use the decoded API key in the fetch request
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
            "Authorization": `Bearer ${API_KEY}`  // Use the decoded API key here
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
