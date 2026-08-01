const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        const response = await fetch("https://huggingface.co", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: userMessage,
                parameters: { max_new_tokens: 40 }
            })
        });

        // Если Hugging Face вернул ошибку сервера, выводим её текст напрямую
        if (!response.ok) {
            const errorText = await response.text();
            return res.send(`Ошибка Hugging Face (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        // Извлекаем чистый текст ответа
        let aiText = "";
        if (Array.isArray(data) && data[0]?.generated_text) {
            aiText = data[0].generated_text;
        } else if (data?.generated_text) {
            aiText = data.generated_text;
        } else {
            aiText = JSON.stringify(data);
        }

        res.send(aiText.trim() || "Пустой ответ от ИИ.");
    } catch (e) {
        res.send("Внутренняя ошибка сервера: " + e.message);
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
