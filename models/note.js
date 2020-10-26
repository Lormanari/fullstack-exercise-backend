const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: npm run dev <password>')
//   process.exit(1)
// }
// const url = process.env.MONGODB_URI
// console.log('connecting to', url)

// const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0.emxpr.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.set('useFindAndModify', false)

// mongoose
//   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
//   .then(() => {
//     console.log('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.log('error connecting to MongoDB:', error.message)
//   })

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minlength: 5,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Note', noteSchema)