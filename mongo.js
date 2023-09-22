const mongoose = require('mongoose');

let password = null;
let url = null;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

switch (process.argv.length) {
    case 3:
        password = encodeURIComponent(process.argv[2]);   
        url = `mongodb+srv://mtellolpz:${password}@cluster0.6lbporm.mongodb.net/the-phonebook?retryWrites=true`;
        mongoose.connect(url);
        Person.find({}).then(persons=> {
            console.log("phonebook:");
            persons.forEach(p => {
                console.log(`${p.name} ${p.number}`);
            });
            mongoose.connection.close();
        })
        break;

    case 5:
        password = encodeURIComponent(process.argv[2]);
        url = `mongodb+srv://mtellolpz:${password}@cluster0.6lbporm.mongodb.net/the-phonebook?retryWrites=true`;
        mongoose.connect(url);
        const person = new Person({
            name: process.argv[3],
            number: process.argv[4]
        });
        person.save().then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`);
            mongoose.connection.close();
        });
        break;

    default:
        console.log('Usage: node mongo.js <password> <person_name> <phone_number>');
        process.exit(1);
        break;
}