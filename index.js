// const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const Note = require('./models/note')

const cors = require('cors')

app.use(cors())
// app.use(express.json())
app.use(bodyParser.json())
app.use(express.static('build'))


const { response } = require('express')

// const note = new Note({
// 	content: 'Mongoose make use of mongo easy',
// 	date: new Date(),
// 	important: true,
// })


let notes = [
	{
	  id: 1,
	  content: "HTML is easy",
	  date: "2019-05-30T17:30:31.098Z",
	  important: true
	},
	{
	  id: 2,
	  content: "Browser can execute only Javascript",
	  date: "2019-05-30T18:39:34.091Z",
	  important: false
	},
	{
	  id: 3,
	  content: "GET and POST are the most important methods of HTTP protocol",
	  date: "2019-05-30T19:20:14.298Z",
	  important: true
	}
  ]

  app.get('/',(req, res) => {
	  res.send('<h1>Hello world!</h1>')
  })

  app.get('/api/notes', (request, response) => {
	Note.find({}).then(notes => {
		console.log(notes)
		response.json(notes.map(note=> note.toJSON()))
	})
	// response.json(notes)
  })

  app.get('/api/notes/:id',(req, res) => {
	//   console.log(id)
	//   const note = notes.find(note => note.id === id)
	//   console.log(note)
	//   if(note) {
	// 	  res.json(note)
	//   } else {
	// 	  res.status(404).end()
	//   }

	Note.findById(req.params.id).then(note => {
		res.json(note.toJSON())
	})
  })

const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
	return maxId + 1
}

app.post('/api/notes', (req, res) => {
	const body = req.body
	if(body.content === undefined) {
		return res.status(400).json({
				error: 'content missing'
		})
	}

	//   const note = {
	// 	  content: body.content,
	// 	  important: body.important || false,
	// 	  date: new Date(),
	// 	  id: generateId(),
	//   }
	// notes = notes.concat(note)

	// res.json(note)
	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note.save().then(savedNote => {
		res.json(savedNote.toJSON())
	})
  })

  app.delete('/api/notes/:id', (request, response, next) => {
	// const id = Number(request.params.id)
	// notes = notes.filter(note => note.id !== id)

	// response.status(204).end()
	Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
	  console.log(`Server running on port ${PORT}`)
  })

//   const app = http.createServer((request, response) => {
// 	response.writeHead(200, { 'Content-Type': 'application/json' })
// 	response.end(JSON.stringify(notes))
//   })

// const port = 3001
// app.listen(port)
// console.log(`Server running on port ${port}`)