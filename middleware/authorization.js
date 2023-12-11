const jwt = require("jsonwebtoken");
User = require("../models/user");

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function(err, decode) {
            if (err) {
                res.status(511)
                    .send({
                        message: err
                    });
            }
            // instead of user, should have another table called token to check the authencity
            User.findOne({
                    userid: decode && decode.userid
                })
                .then((user) => {
                    req.userid = user.userid;
                    req.role = user.role;
                    next();
                }).catch((err) => {
                    res.status(500)
                        .send({
                            message: err
                        });
                });
        });
    } else {
        // to return error response here as well
        req.user = undefined;
        next();
    }
};
module.exports = verifyToken;