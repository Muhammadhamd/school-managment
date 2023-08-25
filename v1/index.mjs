import express from 'express'
import authrouter from './routes/auth.mjs'
import user from "./routes/userchecking.mjs"
const app = express.Router()

app.use(authrouter)
app.use(user)

export default app