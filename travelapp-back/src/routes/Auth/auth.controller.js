const nodemailer = require('nodemailer');
const { postUser, getUser } = require('../../models/users.model');
const { generateToken, verifyToken } = require('../../services/token')
const { validateRegisterUser, validateLoginUser, validateForgotPassword, validateResetPassword } = require('./auth.validation')
const { validationErrors } = require('../../middlewares/validationErrors')
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
    const { id, name } = await postUser(req.body);
    return res.status(200).json({
        message: 'User Registered Successfully',
        token: generateToken({ id, name })
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
                token: generateToken({ id, name })
            });
        }
    }
    return res.status(400).json({
        message: 'Invalid Credentials',
    });
}

// async function forgotPassword(req, res) {
//     const { error } = validateForgotPassword(req.body)
//     if (error) {
//         return res.status(404).json({
//             message: 'Enter an email'
//         })
//     }
//     const user = await findUser(req.body.email);
//     if (!user) {
//         return res.status(400).json({ message: 'user not found' })
//     }
//     const secret = process.env.SECRET_KEY + user.password;
//     const token = generateToken({ id: user._id, name: user.name }, secret, '10m')
//     const link = `http://localhost:5000/auth/reset-password/${user.id}/${token}`

//     const transporter = nodemailer.transporter({
//         service: 'gmail',
//         auth: {
//             user: process.env.APP_EMAIL,
//             pass: process.env.APP_PASSWORD
//         }
//     })

//     const mailOptions = {
//         from: 'abdelaziz.aushar@gmail.com',
//         to: user.email,
//         subject: 'Reset Password',
//         text: link
//     }

//     transporter.sendMail(mailOptions)
//     res.status(200).json({ message: 'Check Your Email' })
// }

// async function resetPassword(req, res) {
//     const { error } = validateResetPassword(req.body)
//     if (error) {
//         return res.status(404).json({
//             message: error
//         })
//     }
//     const user = await findUserById(req.params.id);
//     if (!user) {
//         return res.status(400).json({ message: 'user not found' })
//     }
//     const secret = process.env.SECRET_KEY + user.password;
//     try {
//         verifyToken(req.params.token, secret)
//     } catch (err) {
//         return res.status(500).json(err.message);
//     }
//     await updateUserPassword(user._id, req.body.password);
//     return res.status(200).json({
//         message: 'successfully changed',
//         token: generateToken({ id: user.id, name: user.name })
//     })
// }

module.exports = {
    register,
    login,
    // forgotPassword,
    // resetPassword
}