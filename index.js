const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Делаем прямой запрос к открытому и бесплатному AI-мосту (модель Llama 3)
        const response = await fetch(`https://lolhuman.xyz{encodeURIComponent(userMessage)}`);
        let aiText = await response.text();

        // Ограничиваем длину ответа до 300 символов, чтобы Nightbot его не заблокировал
        if (aiText.length > 300) {
            aiText = aiText.substring(0, 297) + "...";
        }

        res.send(aiText.trim() || "Не удалось получить ответ.");
    } catch (e) {
        res.send("ИИ временно перегружен, попробуй еще раз!");
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
