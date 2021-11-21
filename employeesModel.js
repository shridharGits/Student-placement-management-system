const mongoose = require('mongoose')
const validator = require('validator')

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is unvalid')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 18) {
                throw new Error('You must be above 18')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase() === 'password') {
                throw new Error('password can not be "password"')
            }
        }
    },
    cgpa: {
        type: Number,
        required: true,
    }
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee