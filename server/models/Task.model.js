const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    house: {
        type: ObjectId,
        ref: 'TidyHouse',
        required: true
    },
    assignees: [{
        type: ObjectId,
        ref: 'TidyUser'
    }],
    creator: {
        type: ObjectId,
        ref: 'TidyUser',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    category: {
        type: ObjectId,
        ref: 'TidyCategory',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('TidyTask', taskSchema);