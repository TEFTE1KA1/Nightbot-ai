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
                inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nТы ИИ-помощник стримера. Отвечай кратко на русском языке до 200 символов.<|eot_id|><|start_header_id|>user<|end_header_id|>\n${userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`,
                parameters: { max_new_tokens: 60 }
            })
        });

        const data = await response.json();
        let aiText = data?.generated_text || "";
        if (aiText.includes("assistant")) {
            const parts = aiText.split("assistant");
            aiText = parts[parts.length - 1];
        }
        res.send(aiText.replace(/[<>|]/g, "").trim() || "Ошибка ИИ");
    } catch (e) {
        res.send("ИИ временно недоступен");
    }
});

app.listen(PORT, () => {
    console.log("Server is running");
});
