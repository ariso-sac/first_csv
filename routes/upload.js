var express = require('express');
var router = express.Router();
var csv = require("fast-csv");

// Import required module express, fast-csv, multer, mongodb and fs packages
const multer = require('multer');
//const csv = require('fast-csv');
const mongodb = require('mongodb');
const fs = require('fs');
//const express = require('express');
const app = express();

// Set global directory
global.__basedir = __dirname;

// Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

// Filter for CSV file
const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};
const upload = multer({ storage: storage, fileFilter: csvFilter });

// Upload CSV file using Express Rest APIs
router.post('/', upload.single("file"), (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a CSV file!"
            });
        }

        // Import CSV File to MongoDB database
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err) {
                console.log("%s doesn't exist", path);
            } else {
                console.log('can read/write %s', path);
            }
        });
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", () => {

                // Establish connection to the database


              // Establish connection to the database
              const url = 'mongodb+srv://root:apiuser@cluster0.stnyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
              var dbConn;
              mongodb.MongoClient.connect(url, {
                  useUnifiedTopology: true,
              }).then((client) => {
                  console.log('DB Connected!');
                  dbConn = client.db();

                  //inserting into the table "employees"
                  var collectionName = 'tutorials';
                  var collection = dbConn.collection(collectionName);
                  collection.insertMany(csvData, (err, result) => {
                      if (err) console.log(err);
                      if (result) {
                          res.status(200).send({
                              message:
                                  "Upload/import the CSV data into database successfully: " + req.file.originalname,
                          });
                          client.close();
                      }
                  });
              }).catch(err => {
                  res.status(500).send({
                      message: "Fail to import data into database!",
                      error: err.message,
                  });
              });
          });
  } catch (error) {
      console.log("catch error-", error);
      res.status(500).send({
          message: "Could not upload the file: " + req.file.originalname,
      });
  }
});

module.exports = router;
