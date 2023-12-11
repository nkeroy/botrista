const express = require("express"),
    mongoose = require("mongoose"),
    userRoutes = require("./routes/login/login"),
    productRoutes = require("./routes/product/product"),
    orderRoutes = require("./routes/order/order"),
    app = express();


require("dotenv")
    .config();

//Connect to database
try {
    mongoose.connect("mongodb://localhost:27017/botrista", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("connected to botrista db");

    // Insert dummy data
} catch (error) {
    handleError(error);
}
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

//using user, product and order routes
app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);

//setup server to listen on port 8080
app.listen(process.env.PORT || 8080, () => {
    console.log("Server is live on port 8080");
})