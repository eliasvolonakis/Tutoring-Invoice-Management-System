const credentials = require('./../credentials');
const SESSIONS_PATH = credentials["SESSIONS_PATH"];
const students = require('./../data/students.json');
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

let getEmailByFirstName = function (firstName) {
  let email = "";
  students.forEach(student => {
      if (student.firstName == firstName) {
          email = student.studentEmail;
      };
  });
  if(email == "") {
    console.error(`No Student with first name ${firstName}`);
  }
  return email;
};

let getSessionFeeByFirstName = function (firstName) {
    let sessionFee = 0;
    students.forEach(student => {
        if (student.firstName == firstName) {
            sessionFee = student.sessionFee;
        }
    });
    return sessionFee;
};

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

// let getSessionString = function (event, start, end) {
//     return `${event.summary}!${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}!${utils.getSessionDifference(start, end)}\n`;
// };

let getSessionString = function (event, start, end) {
  let startAmPm = " am";
  let endAmPm = " am";
  let startHour = start.getHours();
  let endHour = end.getHours();
  if (start.getHours() >= 12) {
    startAmPm = " pm";
  }
  if (end.getHours() >= 12) {
    endAmPm = " pm";
  }
  if (start.getHours() > 12) {
    startHour = start.getHours() - 12;
  }
  if (end.getHours() > 12) {
    endHour = end.getHours() - 12;
  }
  return `${event.summary}!${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${startHour}:${String(start.getMinutes()).padStart(2, '0')} ${startAmPm} - ${endHour}:${String(end.getMinutes()).padStart(2, '0')} ${endAmPm}!${utils.getSessionDifference(start, end)}\n`;
};

module.exports = {getEmailByFirstName, getLastNameByFirstName, 
  getSessionFeeByFirstName, outputMonthlySessions, getSessionDifference, getSessionString}