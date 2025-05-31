import users from "../Models/Auth.js";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  const { email } = req.body;
  // console.log(email)
  try {
    const extinguser = await users.findOne({ email });
    if (!extinguser) {
      try {
        const newuser = await users.create({ email });
        const token = jwt.sign(
          {
            email: newuser.email,
            id: newuser._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ result: newuser, token });
      } catch (error) {
        res.status(500).json({ mess: "something went wrong..." });
        return;
      }
    } else {
      const token = jwt.sign(
        {
          email: extinguser.email,
          id: extinguser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ result: extinguser, token });
    }
  } catch (error) {
    res.status(500).json({ mess: "something went wrong..." });
    return;
  }
};
// Controller to get user profile by userId (sent as query parameter)
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId; // Expect userId as query param: /user/profile?userId=123

    if (!userId) {
      return res.status(400).json({ message: "Missing userId in query" });
    }

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function deleteUserByEmail(email) {
  try {
    await users.deleteUserByEmail({ email: "saumymishra08@gmail.com" });

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Error deleting user" };
  }
}
