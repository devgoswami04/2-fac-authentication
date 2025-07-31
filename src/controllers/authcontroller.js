import bcrypt from "bcryptjs";
import speakeasy from   "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
import user from "../models/user.js";
export const register=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const hashedpassword=await bcrypt.hash(password,10);
        const newuser=new user({
            username,
            password:hashedpassword,
            isMfaActive:false,
        });
        console.log("new user: ",newuser);
        await newuser.save();
        res.status(201).json({message:"user registered successfully"});
    }
    catch(error){
        res.status(500).json({error:"Error registering user",message:error});
    }
};
export const login=async(req,res)=>{
    console.log("the authenticated user is: ",req.user);
    res.status(200).json({
        message:"user logged in successfully",
        username:req.user.username,
        isMfaActive:req.user.isMfaActive,
    });
};
export const authStatus=async(req,res)=>{
    if(req.user){
        res.status(200).json({
        message:"user logged in successfully",
        username:req.user.username,
        isMfaActive:req.user.isMfaActive,
        });
    }
    else{
        res.status(401).json({message:"unauthorized user"});
    }
};
export const logout=async(req,res)=>{
    if(!req.user) res.status(401).json({message:"unauthorized user"});
req.logout((err)=>{
    if(err) return res.status(400).json({message:"user not logged in"});
    res.status(200).json({message:"logout sucessful"});
})
};
export const setup2FA=async(req,res)=>{
    try {
        console.log("the request user is: ",res.user);
        const user=req.user;
         var secret = speakeasy.generateSecret();
         console.log("the secret object is: ",secret);
         user.twoFactorSecret=secret.base32;
         user.isMfaActive=true;
         await user.save();
         const url=speakeasy.otpauthURL({
            secret:secret.base32,
            label:`${req.user.username}`,
            issuer:"www.devgoswami.com",
            encoding:"base32",
         });
         const qrimageurl=await qrCode.toDataURL(url);
         res.status(200).json(({
            secret:secret.base32,
            qrCode:qrimageurl,
         }))
    } catch (error) {
        res.status(500).json({error:"Error setting user",message:error});
    }
};
export const verify2FA=async(req,res)=>{
    const {token}=req.body;
    const user=req.user;

    const verified=speakeasy.totp.verify({
        secret:user.twoFactorSecret,
        encoding:"base32",
        token,
    });
    if(verified){
        const jwtToken = jwt.sign({username:user.username},process.env.JWT_SECRET,{expiresIn:"ihr"});
        res.status(200).json({message:"2fa successful",token: jwtToken});
    }
    else{
        res.status(400).json({message:"invalid 2fa"});
    }
}; 
export const reset2FA=async(req,res)=>{
    try {
      const user=req.user;
      user.twoFactorSecret="";
      user.isMfaActive=false;
      await user.save(); 
      res.status(200).json({message:"2fa reset sucessfully"});  
    } catch (error) {
        res.status(500).json({error:"error resetting 2fa",message:error});
    }
};