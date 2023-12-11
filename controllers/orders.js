var Order = require("../models/order");
var Product = require("../models/product");

const { STATUS } = require("../constants/statusCodes");


exports.createOrder = async(req, res) => {
    const checkStock = (req) => {
        return new Promise((resolve) => {
            req.body.products && req.body.products.forEach(product => {
                Product.findOne({
                    name: product.productName,
                    stock: { $gte: product.quantity }
                }).then((productQueryResult) => {
                    if (!productQueryResult) {
                        resolve({
                            message: "Order not created",
                            details: "Either product not exist, or out of stock"
                        });
                    }
                }).catch((err) => {
                    resolve({
                        message: "Technical error during stock check stage",
                        details: err
                    });
                });
            });
        });

    };

    const updateStock = (req) => {
        req.body.products && req.body.products.forEach((product) => {
            Product.updateOne({
                name: product.productName
            }, {
                $inc: { stock: -(product.quantity) }
            }).then((orderUpdateResult) => {
                if (!orderUpdateResult || orderUpdateResult.length === 0) {
                    return {
                        message: "Order not created",
                        details: "Unknown error"
                    };
                }
            }).catch((err) => {
                return {
                    message: "Technical error during stock update stage",
                    details: err
                };
            });
        });
    };

    const createOrder = (req) => {
        // Get user id of customer from JWT
        const orderWithUserId = {
            ...req.body,
            orderedBy: req.userid
        }
        Order.create(orderWithUserId)
            .then((orderInsertResult) => {
                if (!orderInsertResult) {
                    res.status(STATUS.INTERNAL_SERVER_ERROR)
                        .send({
                            message: "Order not created",
                            details: "Unknown error"
                        });
                } else {
                    res.status(STATUS.CREATED)
                        .send({
                            message: "Order created successfully",
                            details: orderInsertResult
                        });
                }
            }).catch((err) => {
                res.status(STATUS.INTERNAL_SERVER_ERROR)
                    .send({
                        message: "Technical error during create order stage",
                        details: err
                    });
            });
    };

    // execute the following steps
    const checkStockResult = await checkStock(req);
    if (checkStockResult && checkStockResult.message) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(checkStockResult);
    } else {
        const updateStockResult = updateStock(req);
        if (updateStockResult && updateStockResult.message) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(updateStockResult);
        } else {
            createOrder(req);
        }
    }
};


exports.viewAllOrders = (req, res) => {
    Order.find({})
        .then((result) => {
            res.status(STATUS.OK)
                .send({
                    message: "Order get successfully",
                    details: result
                });
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};

exports.viewOwnOrders = (req, res) => {
    Order.find({ orderedBy: req.userid })
        .then((result) => {
            res.status(STATUS.OK)
                .send(result);
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};