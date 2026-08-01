module.exports = async (req, res) => {
    const userMessage = req.query.msg; 
    if (!userMessage) return res.send('Задай вопрос! Пример: !ai привет');

    try {
        const response = await fetch(`https://lolhuman.xyz{encodeURIComponent(userMessage)}`);
        let aiText = await response.text();

        if (aiText.length > 250) {
            aiText = aiText.substring(0, 247) + "...";
        }

        res.send(aiText.trim() || "Не удалось получить ответ.");
    } catch (e) {
        res.send("ИИ задумался, повтори вопрос через 5 секунд!");
    }
};
