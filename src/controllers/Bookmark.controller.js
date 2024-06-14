
import { query } from '../db.js';
import apiError from '../utils/apiError.js';
import apiResponse from '../utils/apiResponse.js';


export const getBookmarkedUsers = async (req, res) => {
  try {
    const companyId = req.company[0].id;

    
    const users = await query(`
      SELECT u.*
      FROM users u
      JOIN bookmarks b ON u.id = b.user_id
      WHERE b.company_id = ?
    `, [companyId]);

    if (users.length === 0) {
      throw new apiError(404, "No users bookmarked by this company");
    }
    const results = users[0].map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      location: row.location,
      roles: row.roles
    }));

    const responseData = {
      users: results
    };

    res.status(200).json(new apiResponse(200, responseData, "Bookmarked users retrieved successfully"));
  } catch (error) {
    console.error("Error fetching bookmarked users:", error);
    res.status(500).json(new apiResponse(500, {}, error.message));
  }
};



export const bookmarkUser = async (req, res) => {
    try {
        let { userId } = req.body;
        const companyId = req.company[0].id;

        userId = String(userId).trim();

        
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


export const deleteBookmark = async (req, res) => {
  try {
    const { userId } = req.body;  
    const companyId = req.company[0].id; 

    
    const [bookmark] = await query('SELECT * FROM bookmarks WHERE user_id = ? AND company_id = ?', [userId, companyId]);
    if (!bookmark) {
      throw new apiError(404, "Bookmark not found");
    }

    
    await query('DELETE FROM bookmarks WHERE user_id = ? AND company_id = ?', [userId, companyId]);

    const responseData = {
      message: "Bookmark deleted successfully"
    };

    res.status(200).json(new apiResponse(200, responseData, "Bookmark deleted successfully"));
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json(new apiResponse(500, {}, error.message));
  }
};
