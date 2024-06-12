const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').isIn(['user', 'admin', 'coach']).withMessage('Role must be either user or admin'),
    ];
};

const subscriptionValidationRules = () => {
    return [
        body('price').isNumeric().withMessage('Price must be a number'),
        body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    ];
};

const gymValidationRules = () => {
    return [
        body('address').notEmpty().withMessage('Address is required'),
        body('company').notEmpty().withMessage('Company is required'),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

module.exports = {
    userValidationRules,
    subscriptionValidationRules,
    gymValidationRules,
    validate,
};
