const express = require('express');
const app = express();

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Используем стабильный публичный шлюз ИИ (модель Llama-3)
        const response = await fetch(`https://lolhuman.xyz{encodeURIComponent(userMessage)}`);
        let aiText = await response.text();

        // Если текст ответа слишком длинный, принудительно обрезаем его для Nightbot
        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        res.send(aiText.trim() || "Не удалось получить ответ.");
    } catch (e) {
        res.send("ИИ задумался, повтори вопрос через пару секунд!");
    }
});

module.exports = app;
