var jwt = require("jsonwebtoken");
var User = require("../models/user");
const { STATUS } = require("../constants/statusCodes");



exports.signin = (req, res) => {
    User.findOne({
            userid: req.body.userid,
            password: req.body.password
        })
        .then((user) => {
            if (!user) {
                return res.status(STATUS.BAD_REQUEST)
                    .send({
                        message: "Invalid credentials"
                    });
            }
            //signing token with user id
            var token = jwt.sign({
                userid: user.userid,
                role: user.role
            }, process.env.API_SECRET, {
                expiresIn: 86400
            });

            //responding to client request with user profile success message and  access token .
            res.status(STATUS.OK)
                .send({
                    userid: user.userid,
                    message: "Login successful",
                    accessToken: token,
                });
        }).catch((err) => {
            res.status(STATUS.INTERNAL_SERVER_ERROR)
                .send({
                    message: err
                });
        });
};