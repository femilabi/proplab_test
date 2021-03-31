// This method create custom express validator using middleware
const ResponseHandler = require("./responseHandler");
const { validationResult, body } = require("express-validator");
const { State } = require("../database/index").models;

exports.validationErrs = (req) => {
    const messages = [];
    if (!validationResult(req).isEmpty()) {
        const errors = validationResult(req).array();
        for (const i of errors) {
            messages.push(i);
        }
    }
    return messages;
}

exports.validate = (validations, validate_all = false) => {
    return async (req, res, next) => {
        // console.log(req.body);
        const response = new ResponseHandler(req, res);
        if (req.body && !req?.body?.username) req.body["username"] = req.body["phone"];

        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length && validate_all == false) break;
        }
        let fieldErrs = {};
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            errors = errors.array();
            for (let i = 0; i < errors.length; i++) {
                const err = errors[i];
                fieldErrs[err.param] = err.msg;
            }
        }
        return response
            .assignData("errors", fieldErrs)
            .send();
    };
};

exports.registerValidator = () => {
  return [
    body("email")
        .isEmail()
        .withMessage("Invalid E-mail supplied")
    ,body("firstName")
        .notEmpty()
        .withMessage("First name field is required")
        // .custom((val) => /[^A-za-z\s]/g.test(val))
        // .withMessage("First name supplied is invalid")
    ,body("lastName")
        .notEmpty()
        .withMessage("Middle name field is required")
        // .custom((val) => /[^A-za-z\s]/g.test(val))
        // .withMessage("Middle name supplied is invalid")
    ,body("password")
        .notEmpty()
        .withMessage("password field is required")
        .isLength({ min: 8 })
        .withMessage("password must be 8 characters")
  ]
}

exports.loginValidator = () => {
    return [
        body("email").notEmpty().withMessage("Email field is required"),
        body("password").notEmpty().withMessage("Password field is required")
    ]
}

exports.senatorDataValidator = () => {
    return [
        body("name").notEmpty().withMessage("Name field is required"),
        body("phoneNumber").notEmpty().withMessage("Phone Number field is required"),
        body("email").notEmpty().withMessage("Email field is required"),
        body("state")
            .notEmpty()
            .withMessage("State field is required")
            .custom(async (state_id) => {
                let state = await State.findByPk(state_id);
                return state;
            })
            .withMessage("State supplied is invalid")
    ]
}