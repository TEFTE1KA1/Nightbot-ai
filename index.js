const express = require('express');
const app = express();

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Делаем запрос к официальной бесплатной модели Qwen через быстрый публичный шлюз
        const response = await fetch("https://huggingface.co", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|im_start|>system\nТы краткий ИИ-помощник в чате. Отвечай строго на русском языке и очень кратко, до 150 символов.<|im_end|>\n<|im_start|>user\n${userMessage}<|im_end|>\n<|im_start|>assistant\n`,
                parameters: { max_new_tokens: 50, stop: ["<|im_end|>"] }
            })
        });

        const data = await response.json();
        let aiText = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
        
        if (!aiText) aiText = JSON.stringify(data);

        if (aiText.includes("assistant")) {
            const parts = aiText.split("assistant");
            aiText = parts[parts.length - 1];
        }

        res.send(aiText.replace(/[<>|]/g, "").trim() || "Пустой ответ.");
    } catch (e) {
        res.send("Ошибка: " + e.message);
    }
});

module.exports = app;
