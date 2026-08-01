// Новый, ультра-стабильный код для Vercel без папок
module.exports = async (req, res) => {
    // Разрешаем Найтботу обращаться по любому пути
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        // Подключаем быстрый и бесплатный ИИ-сервер
        const response = await fetch(`https://lolhuman.xyz{encodeURIComponent(userMessage)}`);
        let aiText = await response.text();

        // Автоматически обрезаем под жесткие лимиты Найтбота
        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        res.send(aiText.trim() || "Не удалось получить ответ от нейросети.");
    } catch (e) {
        res.send("ИИ задумался, повтори вопрос через 5 секунд!");
    }
};
