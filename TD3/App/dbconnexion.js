let  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/demo";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected')
});

module.exports  =  connect;