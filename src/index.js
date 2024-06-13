import { config } from 'dotenv';
import {connectDB} from './db.js'
import app from "./app.js";
import apiError from './utils/apiError.js';

config();

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        throw new apiError("error" , err)
    }
})();

