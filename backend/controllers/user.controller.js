const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'db0bmfnsi',
  api_key: '943434661256457',
  api_secret: 'zodgK7Nj-Zhqhg-TbM6UiUYQCl0'
});

const checkUsername = (async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(200).json({ available: false });
    }
    return res.status(200).json({ available: true });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "Server Error" });
  }
});

const register = async (req, res) => {
  try {
    const { name, username, email, dob, profilePicture, gender, password } =
      req.body;
    let profilePhotoUrl = ''
    if (profilePicture) {
      const uploadResult = cloudinary.uploader.upload(profilePicture, { folder: 'user_profiles_picture' })
      profilePhotoUrl = (await uploadResult).secure_url;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      username,
      email,
      dob,
      profilePicture: profilePhotoUrl || '',
      gender,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "Registration Successfully", success: true });
  } catch (error) {
    console.log("Internal Server Error", error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({
      message: "Something is missing, please check!",
      success: false,
    });
  }

  let user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({
      message: "Incorrect Username",
      success: false,
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Incorrect Password",
      success: false,
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  user = {
    _id: user._id,
    username: user.username,
    name: user.name,
    followers: user.followers,
  };
  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ message: "Login Successful", success: true });
};

const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logout Successfully" });
  } catch (error) {
    console.log(error);
  }
};

const loggedProfile = (async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.log(error)
  }
})

const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ message: 'All users fetched', user })
  } catch (error) {
    console.log(error)
  }
}

const searchUser = (async (req, res) => {
  try {
    const { search = '' } = req.query
    const regex = new RegExp(`${search}`, "i")

    const users = await User.find({ username: { $regex: regex } }).select(" profilePicture name username ")
    if (!users.length) {
      return res.status(404).json({ message: 'No users found', success: false })
    }

    return res.status(200).json({ success: true, users })
  } catch (error) {
    console.log(error);
  }
})

const getUserProfile = (async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(200).json({ message: 'User Not Found', success: false })
    }
    return res.status(200).json({ success: true, user })
  } catch (error) {
    console.log(error)
  }
})
module.exports = {
  checkUsername,
  register,
  login,
  logout,
  loggedProfile,
  getAllUser,
  searchUser,
  getUserProfile
};
