const mongoose = require('mongoose');

const userClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    idNumber: {
        type: String,
        required: true,
        unique: true
    },
    birthDate: {
        type: Date,
        required: true,
    },
    phoneNumber:{
        type: String,
        required: true,
        trim: true,
        
    }
    
    },{
        timestamps: true
    });

module.exports = mongoose.model('UserClient', userClientSchema);