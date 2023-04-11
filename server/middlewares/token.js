import jsonwebtoken from "jsonwebtoken";
import userModel from "../model/userModel.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    }
    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) return res.status(400).json({ message: "token invalid" });

  const user = await userModel.findById(tokenDecoded.data);

  if (!user) return res.status(400).json({ message: "user not found" });

  req.user = user;

  next();
};

export default { auth, tokenDecode };
