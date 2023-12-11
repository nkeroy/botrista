var express = require("express"),
    productRouter = express.Router(),
    { create, update, deleteProducts, listProducts } = require("../../controllers/product.js");
verifyToken = require('../../middleware/authorization');

productRouter.post("/products", verifyToken, function(req, res) {
    if (!req.role) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }
    if (req.role === "admin") {
        create(req, res);
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            });
    }
});

productRouter.put("/products", verifyToken, function(req, res) {
    // to refactor into common util method for checking authorization role
    if (!req.role) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }
    if (req.role === "admin") {
        update(req, res);
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            });
    }
});

productRouter.delete("/products", verifyToken, function(req, res) {
    // to refactor into common util method for checking authorization role
    if (!req.role) {
        res.status(403)
            .send({
                message: "Invalid JWT token"
            });
    }
    if (req.role === "admin") {
        deleteProducts(req, res);
    } else {
        res.status(403)
            .send({
                message: "Unauthorised access"
            });
    }
});

productRouter.get("/products", verifyToken, function(req, res) {
    listProducts(req, res);
});

module.exports = productRouter;