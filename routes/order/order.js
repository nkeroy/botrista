var express = require("express"),
    orderRouter = express.Router(),
    { createOrder, viewAllOrders, viewOwnOrders } = require("../../controllers/orders.js");
verifyToken = require('../../middleware/authorization');

orderRouter.post("/orders", verifyToken, function(req, res) {
    if (!req.role) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }
    if (req.role === "customer") {
        createOrder(req, res);
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            });
    }
});

orderRouter.get("/orders", verifyToken, function(req, res) {
    if (!req.role) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }
    if (req.role === "admin") {
        viewAllOrders(req, res);
    } else if (req.role === "customer") {
        viewOwnOrders(req, res);
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            });
    }
});
module.exports = orderRouter;