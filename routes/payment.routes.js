const express = require("express")

const {
   initialize,
   verify,
   webhook,
} = require("../controllers/payment.controller")

const router = express.Router()

router.post("/initialize", initialize)

router.get("/verify", verify)

router.post("/webhook", webhook)

module.exports = router
