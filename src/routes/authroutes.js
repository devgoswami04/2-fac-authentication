import { Router } from "express";
import passport from "passport";
import { register,login,logout,authStatus,setup2FA,verify2FA,reset2FA } from "../controllers/authcontroller.js";

const router=Router();

//Registration routes
router.post("/register",register);
//login route
router.post("/login",passport.authenticate("local"), login);
//auth status route
router.get("/status",authStatus);
//logout route
router.post("/logout",logout);

//2fa setup
router.post("/2fa/setup",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"unauthorized"});
},setup2FA);

//verify route
router.post("/2fa/verify",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"unauthorized"});
},verify2FA);

//reset route
router.post("/2fa/reset",(req,res,next)=>{
    if(req.isAuthenticated()) return next();
    res.status(401).json({message:"unauthorized"});
},reset2FA);

export default router;
