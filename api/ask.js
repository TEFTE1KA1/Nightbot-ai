export default async function handler(req, res) {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Запрос к бесплатному открытому ИИ (модель Llama-3)
        const response = await fetch(`https://lolhuman.xyz{encodeURIComponent(userMessage)}`);
        let aiText = await response.text();

        // Принудительная обрезка длины ответа под лимиты Найтбота
        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        res.send(aiText.trim() || "Не удалось получить ответ.");
    } catch (e) {
        res.send("ИИ задумался, повтори вопрос через 5 секунд!");
    }
}

