const Session = require("../models/session.model")
const User = require("../models/user.model")

const menu = require("../utils/menu")

const { SESSION_STATES } = require("../utils/constant")

const getMainMenu = () => {
   return `
Welcome to Foodie Restaurant 🍽️

Select:

1 - Place an order
99 - Checkout order
98 - Order history
97 - Current order
0 - Cancel order
`
}

const getFoodMenu = () => {
   let response = "Select an item:\n\n"

   menu.forEach((item) => {
      response += `${item.id} - ${item.name} (₦${item.price})\n`
   })

   response += "\n0 - Return to Main Menu"

   return response
}

const processMessage = async (deviceId, message) => {
   let user = await User.findOne({
      deviceId,
   })

   if (!user) {
      user = await User.create({
         deviceId,
      })
   }

   let session = await Session.findOne({
      deviceId,
   })

   if (!session) {
      session = await Session.create({
         deviceId,
      })

      return {
         response: getMainMenu(),
      }
   }

   // Message processing
   if (!message) {
      return {
         response: getMainMenu(),
      }
   }

   // cancel corder

   if (message === "0") {
      session.cart = []

      session.state = SESSION_STATES.MAIN_MENU

      await session.save()

      return {
         response: "Order cancelled.\n\n" + getMainMenu(),
      }
   }

   // view order or cart
   if (message === "97") {
      if (session.cart.length === 0) {
         return {
            response: "No items in cart.\n\n" + getMainMenu(),
         }
      }

      let response = "Current Order:\n\n"

      let total = 0

      session.cart.forEach((item) => {
         response += `${item.name} x${item.quantity} - ₦${item.price * item.quantity}\n`

         total += item.price * item.quantity
      })

      response += `\nTotal: ₦${total}`

      return {
         response,
      }
   }

   // Place orders
   if (message === "1") {
      session.state = SESSION_STATES.SELECTING_ITEMS

      await session.save()

      return {
         response: getFoodMenu(),
      }
   }
}

const handleFoodSelection = async (deviceId, message) => {
   let session = await Session.findOne({
      deviceId,
   })

   if (session.state === SESSION_STATES.SELECTING_ITEMS) {
      const selectedItem = menu.find((item) => item.id === Number(message))

      if (!selectedItem) {
         return {
            response: "Invalid selection.\n\n" + getFoodMenu(),
         }
      }

      const existingItem = session.cart.find(
         (item) => item.itemId === selectedItem.id,
      )

      if (existingItem) {
         existingItem.quantity += 1
      } else {
         session.cart.push({
            itemId: selectedItem.id,

            name: selectedItem.name,

            price: selectedItem.price,

            quantity: 1,
         })
      }

      await session.save()

      return {
         response:
            `${selectedItem.name} added to cart.\n\n` +
            "1 - Add more items\n" +
            "97 - View current order\n" +
            "99 - Checkout",
      }
   }

   return {
      response: "Invalid option.\n\n" + getMainMenu(),
   }
}

module.exports = {
   processMessage,
   handleFoodSelection,
}
