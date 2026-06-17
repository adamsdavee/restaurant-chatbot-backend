const express = require("express")

const { body } = require("express-validator")

const { chat } = require("../controllers/chatbot.controller")

const router = express.Router()

router.post("/", chat)

module.exports = router
