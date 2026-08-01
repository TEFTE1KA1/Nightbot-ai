const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Запрос к бесплатному зеркалу Google Gemini
        const response = await fetch(`https://open-api.xyz{encodeURIComponent(userMessage)}`);
        const data = await response.json();
        
        let aiText = data?.result || data?.response || JSON.stringify(data);

        // Обрезаем до 300 символов, чтобы уложиться в лимиты Найтбота
        if (aiText.length > 300) {
            aiText = aiText.substring(0, 297) + "...";
        }

        res.send(aiText.trim() || "Не удалось получить ответ.");
    } catch (e) {
        res.send("ИИ задумался, повтори вопрос через 5 секунд!");
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
