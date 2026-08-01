import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readData, writeData } from "../utils/storage.js";

const JWT_SECRET = process.env.JWT_SECRET || "socialsphere-secret";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const data = await readData();
    const user = data.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
}

export async function signupUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const data = await readData();
    const exists = data.users.some((user) => user.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    };

    data.users.push(newUser);
    await writeData(data);

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
}
