import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import userRouter from './routes/user.routes.js'
import healthCheckRouter from './routes/healthcheck.routes.js';
import authRoutes from "./routes/auth.routes.js"


config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ALLOWED,
    credentials: true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieparser())


app.use("/", healthCheckRouter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRouter);


export default app;