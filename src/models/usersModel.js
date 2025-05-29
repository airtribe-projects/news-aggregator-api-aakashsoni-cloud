const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        max: 8,
        min: 6
    },
    preferences: {
        type: [String],
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;
