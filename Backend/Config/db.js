import mongoose from "mongoose";

const connectdb = async()=>{
    try {
        const conn =await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 20,
})
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

export default connectdb; 