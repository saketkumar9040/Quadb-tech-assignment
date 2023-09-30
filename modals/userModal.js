import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id:String,
    user_name:String,
    user_email:String,
    user_password:String,
    user_image:String,
    total_orders:Number,
    created_at: Date,
    last_logged_in:Date
});

export const User = mongoose.model("users",userSchema);
