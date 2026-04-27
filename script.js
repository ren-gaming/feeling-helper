// ===============================
// 💬 CHAT DISPLAY FUNCTION
// ===============================
function addMessage(text, sender) {
    const chat = document.getElementById("responseBox");

    const message = document.createElement("div");
    message.classList.add("message", sender);

    message.innerHTML = text;

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}


// ===============================
// 🧠 MAIN ANALYSIS FUNCTION
// ===============================
function analyzeFeeling() {
    const inputRaw = document.getElementById("userInput").value;
    const input = inputRaw.toLowerCase();

    if (input.trim() === "") return;

    // Show user message
    addMessage(inputRaw, "user");

    let response = "";

    // ===============================
    // 🚨 1. SAFETY CHECK (ALWAYS FIRST)
    // ===============================
    const dangerWords = [
        "suicide",
        "kill myself",
        "end my life",
        "want to die",
        "i dont want to live",
        "i don't want to live"
    ];

    if (dangerWords.some(word => input.includes(word))) {
        addMessage(`
            You are not alone.<br>
            Please reach out right now:<br><br>
            <strong>📞 Call or text 988 (US Suicide & Crisis Lifeline)</strong><br>
            If outside the US, contact your local emergency number.
        `, "bot");

        return;
    }

    // ===============================
    // 🧠 2. CONTEXT DETECTION
    // ===============================
    const desirePhrases = [
        "i want to feel",
        "i wanna feel",
        "i want to be",
        "i wanna be",
        "i wish i was"
    ];

    const negationWords = [
        "not",
        "dont",
        "don't",
        "never",
        "no"
    ];

    const isDesire = desirePhrases.some(p => input.includes(p));
    const isNegated = negationWords.some(n => input.includes(n));

    // ===============================
    // 🎯 3. EMOTION CATEGORIES
    // ===============================
    const categories = [
        {
            name: "sad",
            words: ["sad", "depressed", "lonely", "down", "hurt"],
            responses: {
                normal: "I'm sorry you're feeling this way. Try something small like music, a walk, or talking to someone.",
                desire: "Wanting to feel better is a strong first step. Try changing your environment or reaching out."
            }
        },
        {
            name: "anxious",
            words: ["anxious", "nervous", "worried", "stress", "overthinking"],
            responses: {
                normal: "Try grounding yourself: name 5 things you see, slow your breathing, and stay present.",
                desire: "Wanting to feel calmer makes sense. Start with slow breathing and stepping away from stress."
            }
        },
        {
            name: "angry",
            words: ["angry", "mad", "furious", "annoyed"],
            responses: {
                normal: "Take a pause. Try deep breaths or movement to release tension.",
                desire: "Wanting to calm down is a good step. Give yourself space and time."
            }
        },
        {
            name: "happy",
            words: ["happy", "good", "great", "excited"],
            responses: {
                normal: "That's awesome. Share it or write down what made it good.",
                desire: "Wanting to feel happier is completely valid. Try doing something you enjoy.",
                negated: "It sounds like you're not feeling great right now—and that's okay."
            }
        }
    ];

    // ===============================
    // 🔢 4. SCORING SYSTEM
    // ===============================
let scores = [];

for (let category of categories) {
    let score = 0;

    for (let word of category.words) {

        // ❌ Skip counting "happy" if it's part of "I want to feel happy"
        if (isDesire && input.includes(word)) {

            // Check if the word appears AFTER a desire phrase
            let skip = desirePhrases.some(phrase => {
                return input.includes(phrase + " " + word);
            });

            if (skip) continue;
        }

        if (input.includes(word)) {
            score++;
        }
    }

    if (score > 0) {
        scores.push({ category, score });
    }
}
    // Sort by highest score
    scores.sort((a, b) => b.score - a.score);

    // ===============================
    // 🧾 5. BUILD RESPONSE
    // ===============================
    if (scores.length > 0) {

        let top = scores.slice(0, 2); // top 2 emotions

        response += `It sounds like you're feeling `;
        response += top.map(t => t.category.name).join(" and ");
        response += ".<br><br>";

        for (let t of top) {
            let cat = t.category;

            if (isNegated && cat.responses.negated) {
                response += `• ${cat.responses.negated}<br>`;
            }
            else if (isDesire && cat.responses.desire) {
                response += `• ${cat.responses.desire}<br>`;
            }
            else {
                response += `• ${cat.responses.normal}<br>`;
            }
        }

    } else {
        response = "I'm here for you. Try telling me a bit more about how you're feeling.";
    }

    // ===============================
    // 💬 6. SHOW BOT RESPONSE
    // ===============================
    addMessage(response, "bot");

    // Clear input box
    document.getElementById("userInput").value = "";
}
