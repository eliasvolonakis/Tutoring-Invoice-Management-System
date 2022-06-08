const express = require('express');
const router = require('./routes');
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(router);
app.listen(8080, () => console.log("Server running on port 8080"));

// mongoose.connect('mongodb://localhost:27017/usersdb', 
//     {
//         useNewUrlParser: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//     }
// );
