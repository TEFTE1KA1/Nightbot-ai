const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Step 1: Получаем обязательный внутренний токен от DuckDuckGo
        const initRes = await fetch("https://duckduckgo.com", {
            headers: { "x-vqd-accept": "1" }
        });
        const vqd = initRes.headers.get("x-vqd-token");

        if (!vqd) return res.send("Ошибка инициализации чата.");

        // Step 2: Отправляем запрос к ИИ
        const response = await fetch("https://duckduckgo.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-vqd-token": vqd
            },
            body: JSON.stringify({
                model: "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
                messages: [
                    { role: "user", content: `Ответь на русском языке, очень кратко (до 150 символов). Вопрос: ${userMessage}` }
                ]
            })
        });

        const textData = await response.text();
        
        // Разбираем потоковый текст ответа DuckDuckGo
        const lines = textData.split('\n');
        let aiAnswer = "";
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const chunk = line.slice(6).trim();
                if (chunk === '[DONE]') break;
                try {
                    const parsed = JSON.parse(chunk);
                    if (parsed.message) aiAnswer += parsed.message;
                } catch (e) {}
            }
        }

        res.send(aiAnswer.trim() || "Не удалось разобрать ответ.");
    } catch (e) {
        res.send("Ошибка подключения к ИИ: " + e.message);
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
