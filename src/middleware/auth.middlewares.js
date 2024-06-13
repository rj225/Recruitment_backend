import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import {query} from '../db.js';
import apiError from '../utils/apiError.js';

config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', ''));
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized request. Token missing.' });
        }
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decodedToken" , decodedToken);
    
        const [user] = await query('SELECT * FROM users WHERE email = ? AND token = ?', [decodedToken?.username, token]);
    
        console.log("user" , user);
        if (!user || user.length === 0) {
            throw new apiError(401, 'Invalid Access Token');
        }
    
        console.log("user[0]" , user[0]);
        // req.user =
        req.user =  user[0];
        next();
    } catch (error) {
        throw new apiError(401, error?.message || 'Invalid access token');
    }
};



export const isAuthenticatedCompany = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', ''));
        if (!token) {
            throw new apiError(401, "Access denied. No token provided.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [company] = await query('SELECT * FROM companies WHERE c_email = ?', [decoded.id]);


        if (!company) {
            throw new apiError(401, "Invalid token.");
        }

        req.company = company;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json(new apiError(401, {}, 'Authentication failed'));
    }
};



export default { verifyToken, isAuthenticatedCompany };
