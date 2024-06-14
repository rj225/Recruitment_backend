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

const allowedOrigins = (process.env.CORS_ALLOWED || '').split(',');

const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin); 
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // Enable cookies to be sent across domains
  };
  
  app.use(cors(corsOptions));
  

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieparser())


app.use("/", healthCheckRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth', userRouter);
app.use('/api/auth', bookmarkRouter);


export default app;