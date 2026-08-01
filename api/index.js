module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const userMessage = req.query.msg;
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Делаем официальный запрос к бесплатному ИИ на OpenRouter
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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", // ПОДСТАВЬТЕ СВОЙ КЛЮЧ СЮДА
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemma-2-9b-it:free", // Отличная бесплатная и быстрая модель
                "messages": [
                    { "role": "system", "content": "Ты краткий ИИ помощник в чате Твич стримера. Отвечай очень коротко, максимум 2 предложения." },
                    { "role": "user", "content": userMessage }
                ]
            })
        });

        if (!response.ok) {
            return res.send(`Ошибка ИИ: Статус ${response.status}`);
        }

        const data = await response.json();
        let aiText = data.choices?.[0]?.message?.content || "Нейросеть прислала пустой ответ.";

        // Обрезаем для лимитов Nightbot
        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        return res.send(aiText.trim());
    } catch (e) {
        return res.send(`Ошибка скрипта: ${e.message}`);
    }
};
