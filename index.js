const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/ask', async (req, res) => {
    const userMessage = req.query.msg; 

    if (!userMessage) {
        return res.send('Задай вопрос! Пример: !ai привет');
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                { role: "system", content: "Ты — краткий ИИ-помощник в чате стримера. Отвечай строго до 250 символов, емко." },
                { role: "user", content: userMessage }
            ],
            max_tokens: 80
        });

        res.send(response.choices.message.content.trim());
    } catch (error) {
        res.send('Ошибка ИИ. Проверьте настройки ключа.');
    }
});

app.listen(PORT, () => console.log(`Сервер запущен`));
