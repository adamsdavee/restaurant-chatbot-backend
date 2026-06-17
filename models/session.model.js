const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema(
   {
      deviceId: {
         type: String,
         required: true,
         unique: true,
      },

      state: {
         type: String,
         enum: ["MAIN_MENU", "SELECTING_ITEMS", "CHECKOUT"],
         default: "MAIN_MENU",
      },

      cart: [
         {
            itemId: Number,
            name: String,
            price: Number,
            quantity: {
               type: Number,
               default: 1,
            },
         },
      ],
   },
   {
      timestamps: true,
   },
)

module.exports = mongoose.model("Session", sessionSchema)
