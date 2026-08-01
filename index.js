const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Запрос к бесплатному и открытому API Llama-3, который никогда не блокируется
        const response = await fetch("https://chateverywhere.app", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3",
                messages: [{ role: "user", content: `Ответь строго на русском языке, очень кратко, до 150 символов: ${userMessage}` }]
            })
        });

        const data = await response.json();
        let aiText = data?.choices?.[0]?.message?.content || data?.content || "";

        if (aiText.length > 300) {
            aiText = aiText.substring(0, 297) + "...";
        }

        res.send(aiText.trim() || "ИИ прислал пустой ответ.");
    } catch (e) {
        res.send("Сбой сети ИИ. Попробуй еще раз.");
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
