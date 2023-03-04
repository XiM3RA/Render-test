// Usage: node mongo.js <Mongo password> <"Person Name"> <number> -> Adds entry
// Or: node mongjo.js <Mongo password> -> returns the list of entries

const mongoose = require('mongoose')

function main() {

if (process.argv.length < 3) {
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@cluster0.zcssndw.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Define the schema used
const noteSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})

const Entry = mongoose.model('Entry', noteSchema)

if (process.argv.length == 3) {
    console.log("phonebook:")
    Entry.find({}).then(result => {
        result.forEach(entry => {
            console.log(entry.name, entry.phoneNumber)
        })
        mongoose.connection.close()
    })
    return;
    }

const entry = new Entry({
    name: process.argv[3],
    phoneNumber: process.argv[4],
})

entry.save().then(result => {
    console.log('phone number saved!')
    mongoose.connection.close()
})
}

main();

