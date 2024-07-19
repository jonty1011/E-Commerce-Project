import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String, 
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: 'user',
       // Adjust according to your roles
        enum: ['user', 'admin'], 
    },
    
    otp: {
        type: String,
      // Adjust default value as needed
        default: '', 
    },

    isVerified: {
        type: Boolean,
      // Users are not verified by default
        default: false, 
    },
}, {
    timestamps: true,
});

export const User = mongoose.model('User', schema);
