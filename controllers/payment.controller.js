const crypto = require("crypto")

const Order = require("../models/order.model")

const {
   initializePayment,
   verifyPayment,
} = require("../services/paystack.service")

const initialize = async (req, res, next) => {
   try {
      const { orderId, email } = req.body
      const order = await Order.findById(orderId)

      if (!order) {
         return res.status(404).json({
            message: "Order not found",
         })
      }
      const reference = `ORD_${Date.now()}`

      const payment = await initializePayment({
         email,
         amount: order.totalAmount,
         reference,
         callback_url: "http://localhost:5000/api/payments/verify",
      })

      order.paystackReference = reference

      await order.save()

      return res.json({
         authorizationUrl: payment.authorization_url,

         accessCode: payment.access_code,

         reference,
      })
   } catch (e) {}
}

const verify = async (req, res, next) => {
   try {
      const { reference } = req.query

      const payment = await verifyPayment(reference)

      const order = await Order.findOne({
         paystackReference: reference,
      })

      if (!order) {
         return res.status(404).json({
            message: "Order not found",
         })
      }

      if (payment.status === "success") {
         order.paymentStatus = "PAID"

         order.paidAt = new Date()

         await order.save()
      }

      return res.json({
         message: "Payment verified successfully",

         status: order.paymentStatus,

         order,
      })
   } catch (e) {}
}

const webhook = async (req, res) => {
   try {
      const hash = crypto
         .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
         .update(JSON.stringify(req.body))
         .digest("hex")

      if (hash !== req.headers["x-paystack-signature"]) {
         return res.status(401).send("Invalid signature")
      }
      const event = req.body
      if (event.event === "charge.success") {
         const reference = event.data.reference

         const order = await Order.findOne({
            paystackReference: reference,
         })

         if (order) {
            order.paymentStatus = "PAID"

            order.paidAt = new Date()

            await order.save()
         }
      }
      return res.sendStatus(200)
   } catch (e) {}
}

module.exports = {
   initialize,
   verify,
   webhook,
}
