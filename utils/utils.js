const credentials = require('./../credentials');
const SESSIONS_PATH = credentials["SESSIONS_PATH"];

let getLastNameByFirstName = function (firstName) {
    let lastName = "";
    students.forEach(student => {
        if (student.firstName == firstName) {
            lastName = student.lastName;
        };
    });
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
  }
  
let getSessionDifference = function (start, end) {
    let hoursDifference = end.getHours() - start.getHours();
    let minutesDifference = (end.getMinutes() - start.getMinutes()) / 60;
    let totalDifference = hoursDifference + minutesDifference;
    return String(totalDifference);
  }

  module.exports = {getLastNameByFirstName, getSessionFeeByFirstName, outputMonthlySessions, getSessionDifference}