const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const contactSchema = require('./contact.mongo');

const userSchema = new mongoose.Schema({
    name: {
        first_name: {
            type: String,
            required: [true, 'First Name Required'],
            minlength: 2,
            maxlength: 25,
        },
        middle_name: {
            type: String,
            minlength: 2,
            maxlength: 25,
        },
        last_name: {
            type: String,
            required: [true, 'Last Name Required'],
            minlength: 2,
            maxlength: 25,
        }
    },
    email: {
        type: String,
        required: [true, 'Email Required'],
        unique: [true, 'Email Already Registered'],
        lowercase: true,
        validate: [isEmail, 'Enter a Valid Email Adress'],
        minlength: 5,
        maxlength: 100,
        trim: true,
    },
    email_confirmed: {
        type: Boolean,
        default: false
    },
    phone: contactSchema,
    location: {
        country: String,
        city: String
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        minlength: [8, 'Password must be atleast 8 characters long'],
        trim: true,
    },
    gender: {
        type: String,
        default: null
    },
    date_of_birth: {
        type: Date,
        default: null
    },
    profile_pic: {
        type: String,
        default: null
    },
    is_guide: {
        type: Boolean,
        default: false
    },
    wallet_account: {
        type: Number,
        default: 100000
    },
    // trips: {
    //     price: {
    //         type:
    //     }
    // }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})

userSchema.methods.checkCredentials = async function (hashed, password) {
    return await bcrypt.compare(password, hashed);
}

module.exports = mongoose.model('User', userSchema);