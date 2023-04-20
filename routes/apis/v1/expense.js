let express = require("express");
let router = express.Router();
const mongoConnection = require('../../../utils/connections');
const responseManager = require('../../../utils/response.manager');
const expenseModal = require('../../../models/expenses.model');
const userModal = require('../../../models/users.model');
const helper = require('../../../utils/helper');
const constants = require('../../../utils/constants');
let mongoose = require('mongoose');
router.post('/create', helper.authenticateToken, async (req, res) => {
    let {title,amount} = req.body;
        if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
            let primary = mongoConnection.useDb(constants.DEFAULT_DB);
            let userData = await primary.model(constants.MODELS.users, userModal).findById(req.token.userid).lean();
            if (userData) {
                let obj = {
                    title:title,
                    amount:amount,
                    date : Date.now(),
                    userid : mongoose.Types.ObjectId(req.token.userid)
                };
                await primary.model(constants.MODELS.expenses, expenseModal).create(obj);
                return responseManager.onSuccess('Expense created successfully!', 1, res);
            } else {
                return responseManager.unauthorisedRequest(res);
            }
        } else {
            return responseManager.badrequest({ message: 'Invalid token to create expense, please try again' }, res);
        }
});
router.post('/list', helper.authenticateToken, async (req, res) => {
    if (req.token.userid && mongoose.Types.ObjectId.isValid(req.token.userid)) {
        const { page, limit, search } = req.body;
      let primary = mongoConnection.useDb(constants.DEFAULT_DB);
      let userData = await primary.model(constants.MODELS.users, userModal).findById(req.token.userid).lean();
      console.log(userData);
      if (userData) {
        primary.model(constants.MODELS.expenses, expenseModal).paginate({
            $or: [
                { title: { '$regex': new RegExp(search, "i") } },
                { amount: { '$regex': new RegExp(search, "i") } },
            ],
            userid: mongoose.Types.ObjectId(req.token.userid),
        }, {
            page,
            limit: parseInt(limit),
            lean: true
        }).then((expenses) => {
            return responseManager.onSuccess('Expense list!', expenses, res);
        }).catch((error) => {
            return responseManager.onError(error, res);
        });
    } else {
        return responseManager.unauthorisedRequest(res);
    }
    } else {
      return responseManager.badrequest({ message: 'Invalid token to update user profile, please try again' }, res);
    }
  });
module.exports = router;