const crypto = require('crypto');
const sendMail = require('../../../services/sendMail');
const { confirmTokenHelper } = require('./auth.helper');
const { userData } = require('../Users/users.serializer');
const { postBlacklist } = require('../../../models/blacklist.model');
const { generateToken } = require('../../../services/token')
const { validationErrors } = require('../../../middlewares/validationErrors')
const { postRequest, deleteRequests } = require('../../../models/code_confirmation.model');
const { postUser, getUser, putPassword, putEmailConfirmation, addDeviceToken, removeDeviceToken, checkConfirmed } = require('../../../models/users.model');
const { validateRegisterUser, validateLoginUser, validateForgotPassword, validateResetPassword, validateGoogleContinue } = require('./auth.validation')

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
    // check remember me
    req.body.device_token = { 'token': req.body.device_token }
    const user = await postUser(req.body);

    const token = crypto.randomInt(100000, 999999)
    await deleteRequests(user.id)
    await postRequest({ user_id: user.id, token })
    const name = user.name.first_name + ' ' + user.name.last_name
    await sendMail('Confirm Email', req.body.email, { name, token, template_name: 'views/confirm_email.html' });

    return res.status(200).json({
        message: 'Confirm Your Email'
    });
}

// Done
async function confirmEmail(req, res) {
    // Body : email, token
    const user = await getUser(req.body.email);
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }
    if (user.email_confirmed) {
        return res.status(400).json({ message: 'Email Already Confirmed' })
    }
    if (!await confirmTokenHelper(user, req.body.token)) return res.status(400).json({ message: 'Code is Incorrect' })
    await putEmailConfirmation(user)

    await deleteRequests(user.id)
    return res.status(200).json({
        message: 'Email Confirmed Successfully',
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
    if (!user) return res.status(400).json({ message: 'Not Registered' });
    if (!checkConfirmed(user)) return res.status(400).json({ message: 'Confirm Your Email' });
    if (user) {
        const { id, name } = user;
        const check = await user.checkCredentials(user.password, req.body.password);
        if (check) {
            if (req.body.device_token) {
                req.body.device_token = { 'token': req.body.device_token }
                await addDeviceToken(user, req.body.device_token);
            }
            return res.status(200).json({
                message: 'User Logged In',
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
    await sendMail('Forgot Password', req.body.email, { name, token, template_name: 'views/forgot_password.html' });

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

    if (!await confirmTokenHelper(user, req.body.token)) return res.status(400).json({ message: 'Code is Incorrect' })

    await putPassword(user, req.body.password);

    return res.status(200).json({
        message: 'Password Reset Successful',
        token: generateToken({ id: user.id, name: user.name })
    })
}

// Done
async function continueWithGoogle(req, res) {
    const { error } = validateGoogleContinue(req.body)
    if (error) {
        return res.status(400).json({
            errors: validationErrors(error.details)
        })
    }
    let user = await getUser(req.body.email)
    const name = req.body.name.split(' ');
    req.body.name = { first_name: name[0], last_name: name[1] }
    if (!user) user = await postUser(req.body);
    return res.status(200).json({
        message: 'Logged In Successfully',
        profile: userData(user),
        token: generateToken({ id: user.id, name: user.name })
    });
}

// Done
async function logout(req, res) {
    const user = req.user;
    const token = req.headers.authorization.split(' ')[1];
    const data = {
        user_id: user.id,
        token_blacklisted: token,
        user_type: 'User'
    }
    await postBlacklist(data)
    req.body.device_token = { 'token': req.body.device_token }
    await removeDeviceToken(user, req.body.device_token);
    return res.status(200).json({ message: 'Logged Out Successfully' })
}


module.exports = {
    register,
    confirmEmail,
    login,
    forgotPassword,
    resetPassword,
    continueWithGoogle,
    logout
}