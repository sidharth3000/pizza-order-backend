const express = require('express')
const User = require('../models/users')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({user, token})
	} catch (e) {
		res.status(400).send(e)
	}	
})

router.post('/users/login', async (req, res) => {
	 try {
	 	const user = await User.findByCredentials(req.body.email, req.body.password)
	 	const token = await user.generateAuthToken()
	 	res.status(200).send({user, token})
	 } catch (e) {
	 	res.status(404).send('user not found')
	 }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send("logged out succesfully")
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save()
		res.send("logged out successfully")
	} catch (e) {
		res.status(500).send()
	}
})

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	try {
		updates.forEach((update) => req.user[update] = req.body[update])
		await req.user.save()
		res.send(req.user)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove()
		res.send(req.user)
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router