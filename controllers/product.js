var Product = require("../models/product");
var Order = require("../models/order");

const { STATUS } = require("../constants/statusCodes");


exports.create = (req, res) => {
    Product.insertMany(req.body)
        .then((result) => {
            res.status(STATUS.CREATED)
                .send({
                    message: "Products created successfully",
                    details: result
                });
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};

// support update on 1 product
exports.update = (req, res) => {
    Product.updateOne({ name: req.body.name }, {
        $set: { price: req.body.price, stock: req.body.stock }
    })
        .then((result) => {
            res.status(STATUS.CREATED)
                .send({
                    message: "Products updated successfully",
                    details: result
                });
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};

// support delete of multiple products by passing in array
exports.deleteProducts = (req, res) => {

    // First check if there are active orders for the product to be deleted
    const queryExp = [];
    const productsToDelete = req.body;
    productsToDelete.forEach(product => {
        queryExp.push({
            name: product,
            order: 0
        })
    })

    Product.find({ $or: queryExp })
        .then((result) => {
            if (!result) {
                res.status(STATUS.INTERNAL_SERVER_ERROR).send({
                    message: "Internal Server Error",
                    details: "Some unknown error has occured"
                });
            } else if (result && result.length !== req.body.length) {
                res.status(STATUS.INTERNAL_SERVER_ERROR).send({
                    message: "Product deletion error",
                    details: "Either product to be deleted not found, or there is an active order that prevents product from deletion"
                });
            } else {
                Product.deleteMany({ name: { "$in": [...req.body] } })
                    .then((result) => {
                        res.status(STATUS.OK)
                            .send({
                                message: "Products deleted successfully",
                                details: result
                            });
                    }).catch((err) => {
                        res.status(STATUS.INTERNAL_SERVER_ERROR)
                            .send({
                                message: err
                            });
                    });
            }
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};

// support filter by price / stock, >= or <=
/**
 * 
 * @param { filterBy: "price", filterValue: [1], operation: "MORE_THAN"} req 
 * @param {*} res 
 */
exports.listProducts = (req, res) => {
    const filterBy = req.body.filterBy;
    const filterValue = req.body.filterValue;
    const operation = req.body.operation;

    // to allow multiple queries and filters
    let queryExp = {};
    switch (operation) {
        // to consider BETWEEN, so as to reduce query size
        case "MORE_THAN":
            queryExp = {
                [filterBy]: { $gte: filterValue }
            };
            break;
        case "LESS_THAN":
            queryExp = {
                [filterBy]: { $lte: filterValue }
            };
            break;
        case "EQUAL_TO":
            queryExp = {
                [filterBy]: { $eq: filterValue }
            };
            break;
        default:
            res.status(STATUS.BAD_REQUEST)
                .send({
                    message: "The operation provided is invalid"
                });
    }

    Product.find(queryExp)
        .then((result) => {
            res.status(STATUS.OK)
                .send({
                    message: "Products found",
                    details: result
                });
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};