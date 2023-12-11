var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var productOrderSchema = new Schema({
    productName: {
        type: String,
        required: [true]
    },
    quantity: {
        type: Number,
        required: [true]
    }
});

/**
 * Order Schema
 */
var orderSchema = new Schema({
    orderedBy: { type: String, required: [true, "User id is required for orderedBy"] },
    products: {
        type: [productOrderSchema],
        required: [true],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: "Either products not defined or empty"
        }
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);