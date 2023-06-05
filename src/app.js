const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const helpers = require("handlebars-helpers")();
require("./db/conn");
const hbs = require("hbs")
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
var storage= multer.diskStorage({
  destination: function(req,file,cb) {
  cb(null,'uploads/')},
  filename: function(req,file,cb){
    let ext=path.extname(file.originalname)
    cb(null, Date.now()+ext)
  }
  });
// Set up storage for uploaded files
var upload = multer({ storage: storage,
limits:{
  fileSize: 1024*1024*2
}
});
// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials")

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use('/uploads',express.static('uploads'));
app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);
  
const authorschema = new mongoose.Schema({
  name1: String,
  name2: String,
  name3: String,
  content: String,
  file_content: String,
});

app.get("/",(req,res)=>{res.render("index")
})
app.get("/about_us",(req,res)=>{res.render("about_us")
})
app.get("/contact_us",(req,res)=>{res.render("contact_us")
})
app.get("/write",(req,res)=>{res.render("write")
})
app.get("/submitted",(req,res)=>{res.render("submitted")
})
// Create a model based on the schema
const AuthorData = mongoose.model('AuthorData', authorschema);

  app.post("/submit", upload.single("docpicker"), (req, res) => {
    if (!req.file) {
      res.status(400).send('No file uploaded');
      return;
    }
    console.log(req.body);
    console.log(req.file);
    // Create a new instance of the FormData model
    const authordata = new AuthorData({
      name1: req.body.name1,
      name2: req.body.name2,
      name3: req.body.name3,
      content: req.body.inputData,
      file_content:req.file.path
    })
  
    // Save the form data to the database
    authordata.save()
      .then(() => {
        return res.redirect("/submitted");
      })
      .catch((error) => {
        res.status(500).send('Error saving form data');
      });
      
     })
app.listen(port, () => {
    console.log(`server is running at port no ${port}`)
})