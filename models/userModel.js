const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
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
        
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['client', 'driver'],
        default: 'client'
    },
    // this information is inly necessary for drivers
    plate: {
        type: String,
    },
    brand: {
        type: String
    },
    model: {
        type: String
    },
    year: {
        type: String
    }
    
    },{
        timestamps: true
});


userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);