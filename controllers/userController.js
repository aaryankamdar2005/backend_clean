import User from "../models/user-model.js"; // ✅ Use `import` and add `.js` extension
import jwt from "jsonwebtoken"; // ✅ Use `import`
import bcrypt from "bcrypt"; // ✅ Use `import`

// ✅ Handle Login
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isValid = await User.findOne({ email });

    if (!isValid) {
      return res.json({ success: false, message: "Email doesn't exist. Kindly sign up." });
    }

    const isMatch = await bcrypt.compare(password, isValid.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: isValid._id }, "secret", { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Handle Signup
export const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "Email ID already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPwd,
    });

    const token = jwt.sign({ id: newUser._id }, "secret", { expiresIn: "1h" });

    return res.json({ success: true, message: "Signed in successfully", token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
