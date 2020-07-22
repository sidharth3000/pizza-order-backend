const mongoose = require('mongoose')

const Order = mongoose.model('Order', {
	pizza: {
		type: String,
		required: true,
		trim: true
	},
	addOns: {
		type: String,
		trim: true
	},
	address: {
		type: String,
		required: true,
		trim: true
	},
	deliveryMethod: {
		type: String,
		default: 'standard'
	}
}) 

module.exports = Order