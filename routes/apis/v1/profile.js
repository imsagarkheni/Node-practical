let express = require("express");
let router = express.Router();
const mongoConnection = require('../../../utils/connections');
const responseManager = require('../../../utils/response.manager');
const usersModel = require('../../../models/users.model');
const helper = require('../../../utils/helper');
const constants = require('../../../utils/constants');
const joiValidator = require("../../../models/validators/profilevalidator");

let mongoose = require('mongoose');
router.post('/setprofile', helper.authenticateToken, async (req, res) => {
  let userupdateData = req.body;
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
      let primary = mongoConnection.useDb(constants.DEFAULT_DB);
      let userdata = await primary.model(constants.MODELS.users, usersModel).findById(req.token.userid).lean();
      if (userdata) {
          await primary.model(constants.MODELS.users, usersModel).findByIdAndUpdate(req.token.userid, userupdateData).lean();
          let newData = mongoConnection.useDb(constants.DEFAULT_DB);
          let newUserData = await newData.model(constants.MODELS.users, usersModel).findById(req.token.userid).lean();
          return responseManager.onSuccess('Profile updated successfully!', newUserData, res);
      } else {
        return responseManager.badrequest({ message: 'Invalid token to update user profile, please try again' }, res);
      }
    } else {
      return responseManager.badrequest({ message: 'Invalid token to update user profile, please try again' }, res);
    }
});
router.get('/getprofile', helper.authenticateToken, async (req, res) => {
  if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
    let primary = mongoConnection.useDb(constants.DEFAULT_DB);
    let userdata = await primary.model(constants.MODELS.users, usersModel).findById(req.token.userid).lean();
    if (userdata) {
      return responseManager.onSuccess('User profile data!', userdata, res);
    } else {
      return responseManager.badrequest({ message: 'Invalid token to fetch user profile, please try again' }, res);
    }
  } else {
    return responseManager.badrequest({ message: 'Invalid token to update user profile, please try again' }, res);
  }
});

module.exports = router;