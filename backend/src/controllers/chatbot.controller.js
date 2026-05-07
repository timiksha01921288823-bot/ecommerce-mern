const chatbotService = require('../services/chatbot.service');

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const result = await chatbotService.getChatbotAnswer(message);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  chat,
};
