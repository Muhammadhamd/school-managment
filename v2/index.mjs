import express from 'express'
import dashboard from "./routes/dashboard.mjs"
const app = express.Router()


app.use(dashboard)

export default app