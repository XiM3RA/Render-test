const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@cluster0.zcssndw.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Define the schema used
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

//const note = new Note({
//    content: 'Callback-functions suck',
//    important: true,
//})
//
//note.save().then(result => {
//    console.log('note saved!')
//    mongoose.connection.close()
//})


// Proper place to close connection is in the then statement
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
