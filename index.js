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
                inputs: `<s>[INST] Ты ИИ-помощник стримера. Отвечай очень кратко на русском языке до 150 символов. Вопрос: ${userMessage} [/INST]`,
                parameters: { max_new_tokens: 50 }
            })
        });

        const data = await response.json();
        let aiText = data?.[0]?.generated_text || data?.generated_text || "";
        
        if (aiText.includes("[INST]")) {
            const parts = aiText.split("[/INST]");
            aiText = parts[parts.length - 1];
        }
        
        res.send(aiText.trim() || "Не удалось получить ответ от ИИ.");
    } catch (e) {
        res.send("ИИ временно недоступен.");
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
