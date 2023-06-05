const mongoose =require("mongoose");

// Connecting to MongoDB database
const uri = "mongodb+srv://nextgenerationmediation:nF6xRASNKxMdenxu@cluster0.p0ikdol.mongodb.net/?retryWrites=true&w=majority"
async function connect(){
    try{
        mongoose.connect(uri);
        console.log("Connected to mongodb:)")
    }
    catch(error){
        console.log(error)
    }
}
connect();
