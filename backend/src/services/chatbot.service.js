const getChatbotAnswer = async (message) => {
  const normalized = String(message || '').trim().toLowerCase();

  const fallbackAnswer =
    'I can help you choose an outfit, recommend gift ideas, or explain shipping and payment options. Ask me anything about styling or your order.';

  if (!normalized) {
    return { answer: fallbackAnswer };
  }

  if (/(recommend|suggest|style|what should i wear|outfit)/i.test(normalized)) {
    return {
      answer:
        'Try our latest collection: mix a bold printed dress with neutral accessories, pair a denim jacket with tailored trousers, or choose a lightweight kurta and statement sandals for everyday style.',
    };
  }

  if (/(shipping|delivery|track|tracking)/i.test(normalized)) {
    return {
      answer:
        'Orders ship within 24 hours. Standard delivery usually arrives in 3-5 business days, and you can track your order in your account under My Orders.',
    };
  }

  if (/(return|exchange|refund)/i.test(normalized)) {
    return {
      answer:
        'We accept returns and exchanges within 7 days of delivery for eligible items. Visit your order details page and request a return to begin the process.',
    };
  }

  if (/(payment|checkout|razorpay|card|upi)/i.test(normalized)) {
    return {
      answer:
        'You can pay securely with Razorpay. At checkout, choose your preferred payment method, complete the payment, and your order will be confirmed instantly.',
    };
  }

  return {
    answer:
      'That sounds interesting! I recommend checking our curated Style AI page for personalized outfit ideas. You can also ask me about color matches, fits, or current promotions.',
  };
};

module.exports = {
  getChatbotAnswer,
};
