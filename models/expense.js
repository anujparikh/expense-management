var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);