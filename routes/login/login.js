var express = require("express"),
    router = express.Router(),
    {

        signin
    } = require("../../controllers/auth.js");


router.post("/login", signin, function(req, res) {

});

module.exports = router;