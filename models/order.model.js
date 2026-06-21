const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
   {
      deviceId: {
         type: String,
         required: true,
      },

      items: [
         {
            name: String,

            quantity: Number,

            price: Number,
         },
      ],

      totalAmount: {
         type: Number,
         required: true,
      },

      paymentStatus: {
         type: String,
         enum: ["PENDING", "PAID", "FAILED"],
         default: "PENDING",
      },

      paystackReference: {
         type: String,
         default: null,
      },

      scheduledFor: {
         type: Date,
         default: null,
      },

      paidAt: {
         type: Date,
         default: null,
      },
   },
   {
      timestamps: true,
   },
)

module.exports = mongoose.model("Order", orderSchema)
