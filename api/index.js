module.exports = async (req, res) => {
    // Разрешаем CORS, чтобы Nightbot мог спокойно делать запросы
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Забираем сообщение из параметров query (?msg=текст)
    const userMessage = req.query.msg;

    if (!userMessage) {
        return res.send('Задай вопрос! Пример: !ai привет');
    }

    try {
        // Использованы косые кавычки (backticks `) для правильной подстановки переменной
        const apiUrl = `https://lolhuman.xyz{encodeURIComponent(userMessage)}`;
        
        const response = await fetch(apiUrl);
        let aiText = await response.text();

        // Автоматически обрезаем под жесткие лимиты Найтбота
        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        return res.send(aiText.trim() || "Не удалось получить ответ от нейросети.");
    } catch (e) {
        console.error(e);
        return res.send("ИИ задумался, повтори вопрос через 5 секунд!");
    }
};
