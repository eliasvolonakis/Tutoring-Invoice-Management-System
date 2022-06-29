const credentials = require('./../credentials');
const SESSIONS_PATH = credentials["SESSIONS_PATH"];
const students = require('./../data/example-students.json');
const fs = require('fs');

let getLastNameByFirstName = function (firstName) {
    let lastName = "";
    students.forEach(student => {
        if (student.firstName == firstName) {
            lastName = student.lastName;
        };
    });
    if(lastName == "") {
      console.error(`No Student with first name ${firstName}`);
    }
    return lastName;
};

let getSessionFeeByFirstName = function (firstName) {
    let sessionFee = 0;
    students.forEach(student => {
        if (student.firstName == firstName) {
            sessionFee = student.sessionFee;
        }
    });
    return sessionFee;
}

let outputMonthlySessions = function (content) {
    fs.writeFile(SESSIONS_PATH, content, err => {
      if (err) {
        console.error(err)
      }
    });
  };
  
let getSessionDifference = function (start, end) {
    let hoursDifference = end.getHours() - start.getHours();
    let minutesDifference = (end.getMinutes() - start.getMinutes()) / 60;
    let totalDifference = hoursDifference + minutesDifference;
    return String(totalDifference);
  };

let getSessionString = function (event, start, end) {
    return `${event.summary}!${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}!${utils.getSessionDifference(start, end)}\n`;
}

module.exports = {getLastNameByFirstName, getSessionFeeByFirstName, outputMonthlySessions, getSessionDifference, getSessionString}