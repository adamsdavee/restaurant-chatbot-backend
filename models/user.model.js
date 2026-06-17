const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
   {
      deviceId: {
         type: String,
         required: true,
         unique: true,
      },
   },
   {
      timestamps: true,
   },
)

module.exports = mongoose.model("User", userSchema)
