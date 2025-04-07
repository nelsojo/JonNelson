// Function to decode Base64
function decodeBase64(encodedString) {
    return atob(encodedString);  // Built-in JavaScript function
}

// Use the encoded API key
const encodedApiKey = "c2stcHJvai1WSVhfUnJ5bEw4ZW5ZbHFTNnFndzBmNjYyNVl1YVZIS3FIbHhwR05uM2tfc24taTlfMGhtWVRicUhkZnpZT3N6dUo4N2NsV09BMVQzQmxia0ZKd2s5ajBqQ0VUUDMtR19kdjlRRnNDZ052THZHR1RrN2EyYUlPY19DM2hTSjVDai1kWXRzeDlzRkVLdVBoWXQzSThWd3JTRzdVSUE=";
const API_KEY = decodeBase64(encodedApiKey);

// ------------------- COSINE SIMILARITY -------------------
function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

let siteEmbeddings = [];

async function loadSiteEmbeddings() {
    try {
        // Dynamically import the embeddings from site_embeddings.js
        const module = await import('./site_embeddings.js'); // Adjust the path as necessary
        siteEmbeddings = module.siteEmbeddings;
        console.log('Embeddings loaded successfully');
    } catch (error) {
        console.error('Failed to load embeddings', error);
    }
}

// Load embeddings when the page loads
window.onload = () => {
    loadSiteEmbeddings();
};

// ------------------- EMBEDDING FETCH -------------------
async function getEmbedding(text) {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            input: text,
            model: "text-embedding-ada-002"
        })
    });

    const data = await response.json();
    return data.data[0].embedding;
}

// ------------------- SEARCH EMBEDDINGS -------------------
// Adjust to better organize the knowledge base search
async function searchKnowledgeBase(queryEmbedding, topK = 20) {
    const scored = siteEmbeddings.map(item => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding)
    }));

    scored.sort((a, b) => b.score - a.score); // Highest similarity first
    const topMatches = scored.slice(0, topK);  // Return top K matches

    // Log the matches for debugging
    console.log("Top Matches:", topMatches);

    return topMatches;  // Return only the topMatches array
}

// ------------------- MAIN CHAT FUNCTION -------------------
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="message user">${userInput}</div>`;

    try {
        const userEmbedding = await getEmbedding(userInput);
        const topMatches = await searchKnowledgeBase(userEmbedding);

        // Ensure that the topMatches is properly structured and map over them
        const context = topMatches.map(item => `${item.metadata.title} - ${item.text}`).join("\n");

        // Log the context being sent to the API
        console.log("Context being sent to model:", context);

        const prompt = `Use the following content from the website to answer the user's question:\n\n${context}\n\nQuestion: ${userInput}`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        chatBox.innerHTML += `<div class="message bot">${botMessage}</div>`;
    } catch (error) {
        chatBox.innerHTML += `<div class="message bot error">⚠️ Error: ${error.message}</div>`;
        console.error(error);
    }

    document.getElementById("user-input").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}
