const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Делаем запрос к модели Qwen через ваш личный ключ HF_API_KEY
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

        // Если сервер Hugging Face вернул ошибку, выводим её статус
        if (!response.ok) {
            const errText = await response.text();
            return res.send(`Ошибка ИИ-сервера (${response.status}): ${errText.substring(0, 100)}`);
        }

        const data = await response.json();
        let aiText = "";

        if (Array.isArray(data) && data[0]?.generated_text) {
            aiText = data[0].generated_text;
        } else if (data?.generated_text) {
            aiText = data.generated_text;
        } else {
            aiText = JSON.stringify(data);
        }

        // Очищаем ответ от системных тегов модели
        if (aiText.includes("assistant")) {
            const parts = aiText.split("assistant");
            aiText = parts[parts.length - 1];
        }

        res.send(aiText.replace(/[<>|]/g, "").trim() || "Пустой ответ.");
    } catch (e) {
        res.send("Внутренний сбой: " + e.message);
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
