const mongoose = require('mongoose');
const schema = mongoose.Schema;

const roleSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

module.exports = mongoose.model('TidyRole', roleSchema);