//npm i passport passport-local passport-local-mongoose
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//The below line will add on a username and password to our userSchema and make sure that usernames are unique
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);