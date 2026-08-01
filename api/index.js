const https = require('https');

export default async function handler(req, res) {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    const apiUrl = `https://lolhuman.xyz{encodeURIComponent(userMessage)}`;

    https.get(apiUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            let aiText = data.trim();
            
            if (aiText.length > 250) {
                aiText = aiText.substring(0, 247) + "...";
            }
            
            res.send(aiText || "Не удалось получить ответ.");
        });

    }).on("error", (err) => {
        res.send("ИИ задумался, повтори вопрос через 5 секунд!");
    });
}
