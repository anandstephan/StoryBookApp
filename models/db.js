const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect("mongodb+srv://anand123:1234567890@cluster0.sjivs.mongodb.net/storyapp?retryWrites=true&w=majority",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log(`MongoDB connected`)
    }catch(err){
        console.error(err);
        process.exit(1)
    }
}

module.exports = connectDB;