import express, { Request, Response } from "express";
import config from '../config/config';
import { join } from "path";
import User from "../models/users.model";
const IP = require("ip");
const bcrypt = require("bcrypt");
// const User = require("../models/users.model");
import jwt from "jsonwebtoken";
// const jwt = require("jsonwebtoken");
const auth = require("../middle/auth");
const authroute = express.Router();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const bodyParser = require("body-parser");

interface CustomRequest extends Request {
  user?: any;
  token?: any;
}

authroute.post("/signin", async (req, res) => {
  // get tokenid from font end
  const googletoken = req.body.idToken;
  try {
    // check tokenid at google for get the payload 
    const ticket = await client.verifyIdToken({
      idToken: googletoken,
      audience: config.googleAuth.ServerClientID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      res.status(400).send("Invalid token payload");
      return;
    }
    // find user in database
    const user = await User.findOne({ email: payload.email });
    console.log("User found:", user);

    if (!user) {
      // creat user
      const newuser = await User.create({
        email: payload.email,
        name: payload.name,
      });

      console.log("New user created:", newuser);
      const token = jwt.sign({ id: newuser._id }, "passwordKey");
      res.status(200).send(token);
      return;
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.status(200).send(token);
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(400).send("Token verification failed");
  }
});

authroute.get("/userdata", auth, async (req: CustomRequest, res) => {
  const user = await User.findById(req.user);
  if (user !== null) {
    res.json({ ...user, token: req.token });
  }
});

authroute.get("/testip", (req, res) => {
  const ipAddress = IP.address();
  res.send(ipAddress);
});

authroute.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);
    console.log(verified);
    const user = await User.findById(verified);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default authroute;
export { authroute };
