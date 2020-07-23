const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if(!validator.isEmail(value)) {
				throw new error('Email is invalid')
			}
		}
	},
	password: {
		type: String,
		requires:true,
		minlength: 7
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],
	avatar: {
		type: Buffer
	}
})

userSchema.virtual('orders', {
	ref: 'Order',
	localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

// userSchema.methods.getPublicProfile = function () {
// 	const user = this
// 	const userObject = user.toObject

// 	useObject.delete.password

// 	return userObject
// }

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({email})

	if(!user) {
		throw new Error('unable to login')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw new Error('unable to login')
	}

	return user
}

const User = mongoose.model('User', userSchema)

module.exports = User