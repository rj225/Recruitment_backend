import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { config } from 'dotenv';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';

config();

const generateToken = (id, name) => {
    return jwt.sign({ id, name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, location, roles } = req.body;

        if (![name, email, password, location, roles].every(field => field?.trim())) {
            throw new apiError(400, "Name, email, password, location, and roles are required");
        }

        const emailCheckResult = await query('SELECT email FROM users WHERE email = ?', [email]);
        console.log("Email check result: ", emailCheckResult);

        if (emailCheckResult[0].length > 0) {
            throw new apiError(400, "Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query('INSERT INTO users (name, email, password, location, roles) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, location, roles]);

        const userId = result.insertId; // this returns the new id which was inserted now

        const responseData = {
            message: "SignUp successfully",
            userId: userId
        };

        res.status(201).json(new apiResponse(201, responseData, "User signed up successfully"));
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json(new apiResponse(500, {}, error.message));
    }
};





export const register = async (req, res) => {
    try {
        const { c_name, c_email, password } = req.body;

        if (![c_name, c_email, password].every(field => field?.trim())) {
            throw new apiError(400, "Name, email, and password are required");
        }

        const emailCheckResult = await query('SELECT * FROM companies WHERE email = ?', [c_email]);
        if (emailCheckResult[0].length > 0) {
            throw new apiError(200 , "email already exit" ,[])
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query('INSERT INTO companies (c_name, c_email, password, token) VALUES (?, ?, ?, ?)', [c_name, c_email, hashedPassword, ""]);

        const userId = result.insertId;
        // const token = generateToken(userId, name);

        const responseData = {
            message: "Registered successfully",
            userId: userId
        };

        res.status(201).json(new apiResponse(201, responseData, "User signed up successfully"));
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json(new apiResponse(500, {}, error.message));
    }
};





export const login = async (req, res) => {
    try {
        const { c_email, password } = req.body;

        if (!c_email || !password) {
            throw new apiError(400, "Email and password are required");
        }

        // const sql = 'SELECT * FROM users WHERE email = ?';
        const [company] = await query('SELECT * FROM companies WHERE c_email = ?', [c_email]); // Use the query function from js

        if (!company || company.length === 0) {
            throw new apiError(404, "Company does not exist");
        }

        const isPasswordValid = await bcrypt.compare(password, company[0].password);

        if (!isPasswordValid) {
            throw new apiError(401, "Invalid email or password");
        }

        const token = generateToken(c_email, company[0].role); // Generate token with username, user ID, and role

        // Update user document in the database with the generated token
        await query('UPDATE companies SET token = ? WHERE id = ?', [token, company[0].id]);

        const options = {
            httpOnly: true,
            secure: true, // Set to true if you're using HTTPS
        };


        // Exclude sensitive information from the user object
        const { password: userPassword, ...loggedInUser } = company[0];

        return res
            .status(200)
            .cookie('token', token, options)
            .json(
                new apiResponse(
                    200,
                    {
                        company: loggedInUser,
                        token
                    },
                    "You logged in successfully"
                )
            );
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




export const bookmarkUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const companyId = req.company[0].id; // Assuming you have middleware that sets req.company
        console.log(req.company[0]);

        if (![userId].every(field => field?.trim())) {
            throw new apiError(400, "User ID, location, and domain are required");
        }

        // Check if the user exists
        const [user] = await query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            throw new apiError(404, "User not found");
        }

        // Insert the bookmark record
        await query('INSERT INTO bookmarks (user_id, company_id) VALUES (?, ?)', [userId, companyId]);

        const responseData = {
            message: "User bookmarked successfully"
        };

        res.status(201).json(new apiResponse(201, responseData, "User bookmarked successfully"));
    } catch (error) {
        console.error("Error during bookmarking:", error);
        res.status(500).json(new apiResponse(500, {}, error.message));
    }
};






export const logout = async (req, res) => {
    try {
        if (!req.company || !req.company[0].id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        // Update the user document to remove the token field
        await query('UPDATE companies SET token = NULL WHERE id = ?', [req.company[0].id]);

        // Clear the cookie containing the token
        const options = {
            httpOnly: true,
            secure: true, // Set to true if you're using HTTPS
        };

        return res
            .status(200)
            .clearCookie("token", options)
            .json(new apiResponse(200, {}, "User logged out"));
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




