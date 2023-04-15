const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const houseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: ObjectId,
        ref: 'TidyUser'
    }],
    owner: {
        type: ObjectId,
        ref: 'TidyUser',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('TidyHouse', houseSchema);