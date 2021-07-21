const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = 'mongodb+srv://root:apiuser@cluster0.stnyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
db.tutorials = require("./models/products")(mongoose);

module.exports = db;
