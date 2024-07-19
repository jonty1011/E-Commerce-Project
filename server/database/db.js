import mongoose from "mongoose";

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.DBURI);
        console.log("connected to DB");
    }catch(error){
        console.log(error);
    }
}

export default connectDb;