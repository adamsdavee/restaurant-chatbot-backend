require("dotenv").config()
const express = require("express")
const errorHandler = require("./middlewares/errorHandler")
const connectToMongoDB = require("./config/mongoDB")
const logger = require("./utils/logger")

const app = express()
const PORT = process.env.PORT || 3002

connectToMongoDB()

// middlewares
app.use(express.json())

app.use((req, res, next) => {
   logger.info(`Received ${req.method} request to ${req.url}`)
   logger.info(`Request body: ${req.body}`)

   next()
})

// Implement sensitive IP based rate limiting later

// implement redis caching

// app.use("/api/search", searchRouter)

app.get("/", (req, res) => {
   res.send("It is working")
})

app.use(errorHandler)

async function startServer() {
   try {
      app.listen(PORT, () => {
         logger.info(`Search service running at port: ${PORT}`)
      })
   } catch (error) {
      logger.error("Failed to connect to server: ", error)
      process.exit(1)
   }
}

startServer()

process.on("unhandledRejection", (reason, promise) => {
   logger.error(`Unhandled rejection at ${promise} reason: ${reason}`)
})
