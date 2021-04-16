const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

export default ()=>{
    if(mongoose.connection.readyState >= 1) return
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
}