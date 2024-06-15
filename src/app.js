import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import userRouter from './routes/user.routes.js'
import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from "./routes/auth.routes.js"
import bookmarkRouter from './routes/bookmark.routes.js'

config();

const app = express();

// app.use(cors({
//     origin: process.env.CORS_ALLOWED,
//     credentials: true
// }));
// const allowedOrigins = [
//   // 'https://recruitment-solution-eight.vercel.app', // Update with your Vercel frontend URL
//   'http://localhost:3000' // Allow localhost for development
// ];

const allowedOrigins = (process.env.CORS_ALLOWED || '').split(',');

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Enable credentials (cookies)
};
  
  app.use(cors(corsOptions));
  

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieparser())


app.use("/", healthCheckRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth', userRouter);
app.use('/api/auth', bookmarkRouter);


export default app;