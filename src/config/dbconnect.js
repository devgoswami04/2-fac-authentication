import { connect } from "mongoose";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

const dbconnect = async () => {
  try {
    const uri = process.env.CONNECTION_STRING;
    if (!uri) throw new Error("CONNECTION_STRING is undefined");
    
    const mongodbconnection = await connect(uri);
    console.log(`✅ Database connected: ${mongodbconnection.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error}`);
    process.exit(1);
  }
};

export default dbconnect;
