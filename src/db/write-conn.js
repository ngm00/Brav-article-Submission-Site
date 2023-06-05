const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("./conn")
const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a schema for your data
const authorschema = new mongoose.Schema({
  name1: String,
  name2: String,
  name3: String,
  content: String,
  file_content: {
    originalname: String,
    buffer: Buffer,
  },
});

// Create a model based on the schema
const AuthorData = mongoose.model('AuthorData', authorschema);

// Handle form submission
app.post('/submit', (req, res) => {
  // Create a new instance of the FormData model
  const authorData = new AuthorData({
    name1: req.body.name1,
    name2: req.body.name2,
    name3: req.body.name3,
    content: req.body.inputData,
    file_content: {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    }, 
  });

  // Save the form data to the database
  authorData.save()
    .then(() => {
      res.send('Form data saved successfully');
    })
    .catch((error) => {
      res.status(500).send('Error saving form data');
    });
});

