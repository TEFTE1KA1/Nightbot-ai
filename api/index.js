module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const userMessage = req.query.msg;
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Проверьте свой API-ключ вместо YOUR_LOLHUMAN_KEY, если он нужен для lolhuman.xyz
        const apiUrl = `https://lolhuman.xyz{encodeURIComponent(userMessage)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            return res.send(`Ошибка сервера ИИ: Статус ${response.status}`);
        }

        let aiText = await response.text();

        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        return res.send(aiText.trim() || "Нейросеть прислала пустой ответ.");
    } catch (e) {
        return res.send(`Ошибка скрипта: ${e.message}`);
    }
};
