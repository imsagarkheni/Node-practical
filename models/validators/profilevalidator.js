var Joi = require('joi');
const create_profile = Joi.object().keys({
	fullName: Joi.string().trim(),
	userName: Joi.string().trim(),
	contact_no: Joi.string().trim(),
});
module.exports = { create_profile }