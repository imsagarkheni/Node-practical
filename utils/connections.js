let mongoose = require('mongoose');
let mongoDB = mongoose.createConnection("mongodb://127.0.0.1:27017/nodeTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
module.exports = mongoDB;