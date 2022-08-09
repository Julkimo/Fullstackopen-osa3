const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mamelukkikala:${password}@cluster0.hivnr.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook: ')
    Person.find( {} ).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
    })
}
else {
    const personName = process.argv[3]
    const personNumber = process.argv[4]

    const person = new Person({
        name: personName,
        number: personNumber,
    })

    person.save().then(() => {
        console.log('person saved to the phonebook')
    })
}
mongoose.connection.close()
