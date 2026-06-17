const { processMessage } = require("../services/chatbot.service")

const chat = async (req, res, next) => {
   try {
      // Add Joi validation

      const { deviceId, message } = req.body

      const response = await processMessage(deviceId, message)

      res.status(200).json(response)
   } catch (error) {
      next(error)
   }
}

module.exports = {
   chat,
}
