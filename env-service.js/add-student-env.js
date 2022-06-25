require('dotenv').config();
const students_json = require('../data/students.json'); 
const MongoClient = require('mongodb').MongoClient;
const mongo_url = process.env.MONGO_URL;

MongoClient.connect(mongo_url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  students_json.forEach(student => {
    // Replace a students existing document if anything has changed based on the internal students.json
    // By setting upsert to true, if the document does not already exist, it will be added to the collection
    try {
        db.restaurant.replaceOne(
           { "studentName" : student[studentName] },
           student,
           { upsert: true }
        );
    } catch (e){
        console.log(e);
    }
  });
  db.close();
});