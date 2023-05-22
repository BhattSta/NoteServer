const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { createResponseData } = require("../utils/response");
const constant = require("../utils/constants");
const { Users } = require("../models");
const mongoose = require("mongoose");

const checkToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (token) {
      token = token.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      const id = new mongoose.Types.ObjectId(decodedToken.userId);
      const user = await Users.findOne({ _id: id });

      if (decodedToken.exp < Date.now() / 1000) {
        return createResponseData(
          res,
          {},
          httpStatus.UNAUTHORIZED,
          true,
          constant.TOKEN_EXPIRED
        );
      }

      if (user) {
        req.userData = decodedToken;
        next();
      } else {
        return createResponseData(
          res,
          {},
          httpStatus.NOT_FOUND,
          true,
          constant.USER_NOT_FOUND
        );
      }
    }
  } catch (error) {
    console.log(error);
    return createResponseData(
      res,
      {},
      httpStatus.INTERNAL_SERVER_ERROR,
      true,
      constant.TOKEN_EXPIRED
    );
  }
};

module.exports = {
  checkToken,
};
