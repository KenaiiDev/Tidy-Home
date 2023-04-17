const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
const crypto = require('node:crypto');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'active'],
        default: 'pending'
    },
    confirmationCode: {
        type: String,
        unique: true,
    },
    role: {
        type: ObjectId,
        ref: 'TidyRole'
    },
    home: {
        type: ObjectId,
        ref: 'TidyHome'
    },
    busySchedule: [{
        from: Date,
        to: Date
    }],
    hash: String,
    salt: String,
}, {timestamps: true});


//Method to set salt and hash the password for a user
//setPassword method first create a salt for every user
//then it hashes the salt with user password and create a hash
//this hash is stored in the database as user password
userSchema.methods.setPassword = function(password){
    //Create a unique salt for a particular user
    console.log("set password")
    this.salt = crypto.randomBytes(16).toString('hex');

    //Hash user's salt and password
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    console.log(this)
}

// Method to check the entered password is correct or not
// valid password method checks whether the user
// password is correct or not
// It takes the user password from the request
// and salt from user database entry
// It then hashes user password and salt
// then checks if this generated hash is equal
// to user's hash in the database or not
// If the user's hash is equal to generated hash
// then the password is correct otherwise not

userSchema.methods.validPassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

module.exports = mongoose.model('TidyUser', userSchema);