const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('forgot password')
    process.exit(1)
}

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const url = `mongodb+srv://bijobijok:${password}@torniek.oklvpdi.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
} else if (process.argv.length === 5) {   
    const person = new Person ({
        name: inputName,
        number: inputNumber,
    })
    
    person.save().then(result => {
        console.log(`added ${inputName} number ${inputNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log("prompt should be: password or password name number")
    process.exit(1)
}
