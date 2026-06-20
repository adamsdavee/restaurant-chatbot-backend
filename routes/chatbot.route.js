const express = require("express")
const { chat, selectFood } = require("../controllers/chatbot.controller")

const chatbotRouter = express.Router()

chatbotRouter.post("/", chat)
chatbotRouter.post("/selectfood", selectFood)

module.exports = chatbotRouter
