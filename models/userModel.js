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
        enum: ['client', 'driver'],
        default: 'client'
      }
    
    },{
        timestamps: true
});


userSchema.methods.comparePassword = async function(enteredPassword) {
    console.log(enteredPassword,this.password);
    console.log(this.email);
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);