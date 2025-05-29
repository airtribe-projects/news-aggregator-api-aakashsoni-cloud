const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const MIN_PASSWORD_LENGTH = 6;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSignup = async (req, res) => {
  const { name, email, password, preferences } = req.body;
  if (!email || !password || !name || !Array.isArray(preferences)) {
    res
      .status(400)
      .json({ message: "Invalid request. Missing required fields." });
    return;
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    });
  }

  if (
    !Array.isArray(preferences) ||
    preferences.some((p) => typeof p !== "string")
  ) {
    return res.status(400).json({
      message: "Preferences must be an array of strings.",
    });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      preferences,
    };

    const createdUser = await usersModel.create(newUser);

    return res.status(201).json({
      user: {
        name: createdUser.name,
        email: createdUser.email,
        preferences: createdUser.preferences,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({ message: "User not created" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    const dbUser = await usersModel.findOne({ email: email });

    if (!dbUser) {
      return res.status(401).send({ message: "Invalid email" });
    }

    const isPasswordValid = bcrypt.compareSync(password, dbUser.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const user = {
      name: dbUser.name,
      email: dbUser.email,
      preferences: dbUser.preferences,
    };

    const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });

    delete dbUser.password;
    return res.status(200).send({ token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserPreferences = (req, res) => {
  // Implement logic to retrieve user preferences from the database
  if (req.user.email == "") {
    return res.status(403).send({ message: "Forbidden" });
  }
  res.status(200).json({ preferences: req.user.preferences });
};

const updateUserPreferences = (req, res) => {
  if (req.user.email == "") {
    return res.status(403).send({ message: "Forbidden" });
  }

  if (!Array.isArray(req.body.preferences)) {
    return res
      .status(400)
      .json({ message: "Invalid request. Preferences must be an array." });
  }

  req.user.preferences = req.body.preferences;
  usersModel
    .updateOne(
      { email: req.user.email },
      { $set: { preferences: req.user.preferences } }
    )
    .exec()
    .then(() => {
      res.status(200).json({ message: "Preferences updated successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error updating preferences" });
    });
};

module.exports = {
  userSignup,
  userLogin,
  getUserPreferences,
  updateUserPreferences,
};
