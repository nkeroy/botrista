var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Schema
 */
var productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Name not provided"]
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: [true, "Price not provided"]
    },
    stock: {
        type: Number,
        required: [true, "Stock not provided"]
    }
});

module.exports = mongoose.model('Product', productSchema);