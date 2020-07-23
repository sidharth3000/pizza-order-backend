const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: '201952234@iiitvadodara.ac.in',
		subject: 'PIZZA thanks for joining',
		text: `Welcome to PIZZA, ${name}. Get your tasty pizza deliverd to your doorstep here!`
	})
}

const sendConfirmEmail = (pizza, name, email) => {
	// console.log(pizza,name,email)
	sgMail.send({
        to: email,
        from: '201952234@iiitvadodara.ac.in',
        subject: 'Order recieved',
        text: `Hi ${name}, we recieved your order for ${pizza} pizzaoo. It will be deliverd to you in 30 mins. `
    })

}

module.exports = {
	sendWelcomeEmail,
	sendConfirmEmail
}