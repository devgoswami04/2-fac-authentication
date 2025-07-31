import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

passport.use(new LocalStrategy(async (username, password, done)=> {

    try{
        const user=await user.findOne({username});
        if(!user) return done(null,false,{message:"user not found"});

        const ismatch= await bcrypt.compare(password,user.passport);
        if(ismatch) return done(null,user);
        else return done(null,false,{message:"incorrect password"});
    }
    catch(error){
        return done(error);
    }
  }
));

passport.serializeUser((user,done)=>{
    console.log("we are inside serialize user");
    done(null,user._id);
});

passport.deserializeUser(async(_id,done)=>{
    
    try{
        console.log("we are inside deserialize user");
    const user=await user.findById(_id);
    done(null,user);
    }
    catch(error){
        done(error);
    }
});