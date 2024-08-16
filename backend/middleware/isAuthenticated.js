import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Check if token is present
    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    // Attach the user ID to the request object for use in other routes
    req.id = decoded.userId;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default isAuthenticated;
