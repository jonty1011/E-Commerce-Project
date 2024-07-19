import {User} from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from "../middlewares/sendMail.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User Already Exists"
            });
        }

        // Ensure password is provided
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // Ensuring OTP is a 6-digit number

        user = new User({
            name,
            email,
            password: hashPassword,
            otp: otp,
            role: 'user' // Assuming the default role is 'user'
        });

        await user.save();

        const payload = { 
            email: user.email,
            otp 
        };

        console.log("Token payload:", payload);

        const activationToken = jwt.sign(
            payload,
            process.env.Activation_Secret,
            {
                expiresIn: "5m" // 5 minutes
            }
        );

        await sendMail(
            email,
            "Let's Negotiate",
            `Please Verify your Account using the following OTP: ${otp}`
        );

        res.status(200).json({
            message: "OTP sent to your email",
            activationToken,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
      const { otp } = req.body;
      const authorizationHeader = req.headers["authorization"];
  
      if (!authorizationHeader) {
        return res.status(401).json({
          message: "Authorization header missing",
        });
      }
  
      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          message: "Token missing from authorization header",
        });
      }
  
      let verify;
      try {
        verify = jwt.verify(token, process.env.Activation_Secret);
        console.log("Decoded Token:", verify); // Debug logging
      } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(400).json({
          message: "OTP expired or invalid token",
        });
      }
  
      if (!verify || !verify.email) {
        return res.status(400).json({
          message: "Invalid token structure",
        });
      }
  
      // Ensure both OTPs are strings for comparison
    if (String(verify.otp) !== String(otp)) {
        return res.status(400).json({
          message: "Wrong OTP",
        });
      }
  
      let user = await User.findOne({ email: verify.email });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      user.isVerified = true; // Mark user as verified
      await user.save();
  
      res.json({
        message: "User verified",
      });
    } catch (error) {
      console.error("Error verifying user:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };
  

export const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user)
            return res.status(400).json ({
        message:"Invalid Credentials",
    });

    const matchPassword = await bcrypt.compare(password, user.password);
    if(!matchPassword)
        return res.status(400).json({
    message:"Invalid Credentials",
});

const token = jwt.sign({_id: user._id } , process.env.JWT_SEC,{
    // 15 days 
    expiresIn: "15d",
});

res.json({
    message: `welcome back ${user.name}`,
    token,
    user,
});

        
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};

export const myProfile = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id)
        res.json({user});
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}


