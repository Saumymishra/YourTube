import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        // Verify the token using the correct secret
        let decodedData = jwt.verify(token, process.env.JWT_SECRET); // Ensure the secret is correctly referenced
        req.userid = decodedData?.id; // Attach the user ID to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

export default auth;
