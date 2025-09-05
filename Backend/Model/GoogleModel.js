import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  name: { type: String },
  email: { type: String, unique: true },
  profilePicture: { type: String },
});

const GoogleModel = mongoose.model('GoogleUser', UserSchema);

export default  GoogleModel