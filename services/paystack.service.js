const axios = require("axios")

const { PAYSTACK_SECRET_KEY, PAYSTACK_BASE_URL } = require("../config/paystack")

const initializePayment = async ({
   email,
   amount,
   reference,
   callback_url,
}) => {
   const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
         email,
         amount: amount * 100,
         reference,
         callback_url,
      },
      {
         headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
         },
      },
   )

   return response.data.data
}

const verifyPayment = async (reference) => {
   const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
         headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
         },
      },
   )

   return response.data.data
}

module.exports = {
   initializePayment,
   verifyPayment,
}
