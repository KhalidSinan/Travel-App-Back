const crypto = require('crypto');
const { userData } = require('../Users/users.serializer');
const { postUser, getUser, putPassword, putEmailConfirmation } = require('../../models/users.model');
const { generateToken, verifyToken } = require('../../services/token')
const { validateRegisterUser, validateLoginUser, validateForgotPassword, validateResetPassword } = require('./auth.validation')
const { validationErrors } = require('../../middlewares/validationErrors')
const { postRequest, deleteRequests, getToken } = require('../../models/code_confirmation.model');
const sendMail = require('../../services/sendMail');
require('dotenv').config();

// Done
async function register(req, res) {
    const { error } = validateRegisterUser(req.body)
    if (error) {
        return res.status(400).json({
            errors: validationErrors(error.details)
        })
    }
    req.body.name = { 'first_name': req.body.first_name, 'last_name': req.body.last_name }
    const user = await postUser(req.body);

    const token = crypto.randomInt(100000, 999999)
    await deleteRequests(user.id)
    await postRequest({ user_id: user.id, token })
    const name = user.name.first_name + ' ' + user.name.last_name
    await sendMail('Confirm Email', req.body.email, { name, token, template_name: 'public/templates/confirm_email.html' });

    return res.status(200).json({
        message: 'Confirm Your Email'
    });
}

async function confirmEmail(req, res) {
    // Body : email, token
    const user = await getUser(req.body.email);
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }
    if (user.email_confirmed) {
        return res.status(400).json({ message: 'Email Already Confirmed' })
    }
    const tokenSaved = await getToken(user.id)

    console.log(tokenSaved.token)

    if (req.body.token != tokenSaved.token) {
        return res.status(400).json({
            message: 'Code is Incorrect'
        })
    }
    await putEmailConfirmation(user)

    await deleteRequests(user.id)
    return res.status(200).json({
        message: 'Email Confirmed Successfully',
        profile: userData(user),
        token: generateToken({ id: user.id, name: user.name })
    });
}

// Done
async function login(req, res) {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({
            errors: validationErrors(error.details)
        });
    }
    const user = await getUser(req.body.email);
    if (user) {
        const { id, name } = user;
        const check = await user.checkCredentials(user.password, req.body.password);
        if (check) {
            return res.status(200).json({
                message: 'User Logged In',
                profile: userData(user),
                token: generateToken({ id, name }),
            });
        }
    }
    return res.status(400).json({
        message: 'Invalid Credentials',
    });
}

// Done
async function forgotPassword(req, res) {
    const { error } = validateForgotPassword(req.body)
    if (error) {
        return res.status(404).json({
            errors: validationErrors(error.details)
        })
    }
    const user = await getUser(req.body.email);
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }

    const token = crypto.randomInt(100000, 999999)

    await deleteRequests(user.id)
    await postRequest({ user_id: user.id, token })

    const name = user.name.first_name + ' ' + user.name.last_name
    await sendMail('Forgot Password', req.body.email, { name, token, template_name: 'public/templates/forgot_password.html' });

    res.status(200).json({ message: 'Check Your Email' })
}

// Done
async function resetPassword(req, res) {
    const { error } = validateResetPassword(req.body)
    if (error) {
        return res.status(404).json({
            errors: validationErrors(error.details)
        })
    }
    const user = await getUser(req.body.email);
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }

    const tokenSaved = await getToken(user.id)

    if (req.body.token != tokenSaved.token) {
        return res.status(400).json({
            message: 'Code is Incorrect'
        })
    }

    await putPassword(user, req.body.password);

    return res.status(200).json({
        message: 'Password Reset Successful',
        token: generateToken({ id: user.id, name: user.name })
    })
}

function codeConfirmation(token, savedToken) {
    if (token != savedToken) {
        return res.status(400).json({
            message: 'Code is Incorrect'
        })
    }
    return;
}

module.exports = {
    register,
    confirmEmail,
    login,
    forgotPassword,
    resetPassword
}