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

        const data = await response.json();
        
        // Отправляем на экран всё, что прислал Hugging Face, без фильтров
        res.send(JSON.stringify(data));
    } catch (e) {
        res.send("Сбой сети сервера: " + e.message);
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
