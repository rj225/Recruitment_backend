import { query } from '../db.js';

export const getAllUsers = async (req, res) => {
    try {
      // Query to fetch all users
      const users = await query('SELECT id, name, email, location, roles FROM users');
  
      res.status(200).json(users); // Return the users as JSON response
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' }); // Handle errors
    }
  };