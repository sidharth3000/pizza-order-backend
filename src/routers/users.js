const express = require('express')
const User = require('../models/users')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendWelcomeEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		console.log('1')
		sendWelcomeEmail(user.email, user.name)
		console.log('2')
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

const upload = multer({
	limits: {
		fileSize: 2000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.endsWith('jpg')) {
			return cb(new Error('please upload a jpg file'))
		}

		cb(undefined, true)
	}
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	req.user.avatar = req.file.buffer
	await req.user.save()
	res.status(201).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined
	await req.user.save()
	res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router