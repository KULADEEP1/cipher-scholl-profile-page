import userModel from "../model/userModel.js";
import jsonwebtoken from "jsonwebtoken";


const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser)
      return res.status(400).json({ message: "user aldreay exist" });

    const user = new userModel();

    user.username = username;
    user.email = email;
    user.setPassword(password);

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({ token, ...user._doc, id: user.id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel
      .findOne({ username })
      .select("username password salt id email");

    if (!user) return res.status(400).json({ message: "user not found" });

    if (!user.validPassword(password))
      return res.status(400).json({ message: "wrong password" });

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    user.password = undefined;
    user.salt = undefined;
    return res.status(200).json({ token, ...user._doc,id: user.id });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return res.status(400).json({ message: "user not found" });
    if (!user.validPassword(password))
      return res.status(400).json({ message: "wrong password" });
    user.setPassword(newPassword);
    await user.save();
    return res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
}; 
export default { signupUser, loginUser, updatePassword };
