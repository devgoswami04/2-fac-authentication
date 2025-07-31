import express, { json,urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbconnect from "./config/dbconnect.js";
import authroutes from "./routes/authroutes.js";
import "./config/passportconfig.js";

dotenv.config();
dbconnect();

const app=express();

//middlewares
const corsOptions={
    origin:["http://localhost:5174"],
    credentials:true,
};
app.use(cors(corsOptions));
app.use(json({limit:"100mb"}));
app.use(urlencoded({limit:"100mb",extended:true}));
app.use(session({
    secret:process.env.SESSION_SECRET || "SEcret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60000*60, 
    },

})
);

app.use(passport.initialize());

app.use(passport.session());
//routes
app.use("/api/auth",authroutes);

//listen app
const PORT =process.env.PORT || 7002;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})