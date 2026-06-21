const Order = require("../models/order.model")

const createOrderFromCart = async (deviceId, cart) => {
   if (!cart.length) {
      return null
   }

   const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
   )

   const order = await Order.create({
      deviceId,

      items: cart,

      totalAmount,

      paymentStatus: "PENDING",
   })

   return order
}

const getOrderHistory = async (deviceId) => {
   return Order.find({
      deviceId,
   }).sort({
      createdAt: -1,
   })
}

module.exports = {
   createOrderFromCart,
   getOrderHistory,
}
