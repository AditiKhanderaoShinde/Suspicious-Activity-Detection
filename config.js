let mongoose = require('mongoose')
let database = 'restourant'
mongoose.connect(`mongodb://127.0.0.1:27017/${database}`)
    .then(() => {
        console.log('Mongoose Connect Successfully...');
    }).catch(() => {
        console.log('Mongoose Connect Failed...');
    })