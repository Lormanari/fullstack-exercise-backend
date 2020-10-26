require('dotenv').config()
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
// notesRouter.get('/', (req, res) => {
// 	Note.find({}).then(notes => {
// 		res.json(notes.map(note => note.toJSON()))
// 	})
// })
notesRouter.get('/', async (req, res) => {
	const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
	res.json(notes.map(note => note.toJSON()))
})

// notesRouter.get('/:id', (req, res, next) => {
// 	Note.findById(req.params.id)
// 		.then(note => {
// 			if(note) {
// 				res.json(note.toJSON())
// 			} else {
// 				res.status(404).end()
// 			}
// 		})
// 		.catch(error => next(error))
// })
notesRouter.get('/:id', async (req, res) => {
	const note = await Note.findById(req.params.id)
	if(note) {
		res.json(note.toJSON())
	} else {
		res.status(404).end()
	}
})

// notesRouter.post('/', (req, res, next) => {
// 	const body = req.body

// 	const note = new Note({
// 		content: body.content,
// 		important: body.important || false,
// 		date: new Date()
// 	})

// 	note.save()
// 		.then(savedNote => {
// 			res.json(savedNote.toJSON())
// 		})
// 		.catch(error => next(error))
// })
const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

notesRouter.post('/', async (req, res) => {
	const body = req.body

	const token = getTokenFrom(req)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)
	// const user = await User.findById(body.userId)

	const note = new Note({
		content: body.content,
		important: body.important === undefined ? false : body.important,
		date: new Date(),
		user: user._id //body.userId
	})

	const savedNote = await note.save()

	// save note id to User notes field
	user.notes = user.notes.concat(savedNote._id)
	await user.save()

	res.json(savedNote.toJSON())
})

// notesRouter.delete('/:id', (req, res, next) => {
// 	Note.findByIdAndRemove(req.params.id)
// 		.then(() => {
// 			res.status(204).end()
// 		})
// 		.catch(error => next(error))
// })
notesRouter.delete('/:id', async (req, res) => {
	await Note.findByIdAndRemove(req.params.id)
	res.status(204).end()

})

notesRouter.put('/:id', (req, res, next) => {
	const body = req.body

	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(req.params.id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote.toJSON())
		})
		.catch(error => next(error))
})

module.exports = notesRouter