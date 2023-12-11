var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var userSchema = new Schema({
    userid: {
        type: String,
        required: [true, "User ID not provided"],
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        required: [true, "Please specify user role"]
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);