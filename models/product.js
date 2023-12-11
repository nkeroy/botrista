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
    },
    // to keep track of whether there is an existing order for a product, add in new field here
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', productSchema);