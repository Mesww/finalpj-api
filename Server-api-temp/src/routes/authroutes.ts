import express, { Request, Response } from "express";
const IP = require('ip');
const bcrypt = require("bcrypt");
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const auth = require('../middle/auth');
const authroute = express.Router();

interface CustomRequest extends Request {
  user?: any;
  token?: any;
}

authroute.post("/signup", async (req, res) => {
    try {
      const { studentid, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "User with same email already exists!" });
      }
      const hashedPassword = await bcrypt.hash(password, 8);
  
      let user = new User({
        email,
        password: hashedPassword,
        studentid,
      });
      user = await user.save();
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

authroute.post("/signin", async (req, res) => {
    try {
        const {studentid,password}= req.body;
        const user = await User.findOne({studentid});
        
        if(!user){
            return res.status(400).json({msg:"User with this studentid does not exist!"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(400).json({msg:"Incorrect password"});
        }

        const token = jwt.sign({id:user._id},"passwordKey");
        res.json({token, ...user._doc});
    } catch (error) {
        res.status(500).json({error:error});
    }
})

authroute.get('/userdata',auth ,async(req: CustomRequest ,res)=>{
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});
  
authroute.get('/testip', (req, res) => {
    const ipAddress = IP.address();
    res.send(ipAddress)
})

authroute.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


export default authroute;
export { authroute };
