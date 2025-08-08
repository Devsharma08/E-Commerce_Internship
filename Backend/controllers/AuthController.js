const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');


const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ msg: "Registration failed. Name, email, and password are required." });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: `User with email ${email} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: "Registered successfully",
      name: newUser.name,
      email: newUser.email,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ msg: "Server error during registration." });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password." });
    }

    const token = jwt.sign({name:user.name,_id:user._id,email:user.email,isAdmin:user.isAdmin},'abc',{expiresIn:'1d'})

    

    return res.status(200).json({
      msg: "Login successful",
      user:{
        name: user.name,
        email: user.email,
        id: user._id,
        isAdmin: user.isAdmin,
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Server error during login." });
  }
};


const getAllUser = async(req,res)=>{

  const user = await User.find({});
  // let payload = req.user
  res.status(200).json({user});

}


module.exports = {registerUser,loginUser,getAllUser}