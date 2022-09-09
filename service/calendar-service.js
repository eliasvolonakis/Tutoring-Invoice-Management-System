const credentials = require('./../credentials');
const utils = require('./../utils/utils.js');
const { google } = require('googleapis');
const CREDENTIALS = credentials["CALENDAR_CREDENTIALS"];
const CALENDAR_ID = credentials["CALENDAR_ID"];

const SCOPES = ['https://www.googleapis.com/auth/calendar', 
'https://www.googleapis.com/auth/calendar.events', 
'https://www.googleapis.com/auth/calendar.readonly']

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const calendar = google.calendar({version : "v3", auth});


// Replace above with this for first and last day of month
var date = new Date();
console.log("Date: " + date.toDateString());
var timeMin = new Date(date.getFullYear(), date.getMonth() + 1, 1);
var timeMax = new Date(date.getFullYear(), date.getMonth() + 2, 0);

let sessions = "";

function listEvents() {
  calendar.events.list({
    calendarId: CALENDAR_ID,
    // timeMin and timeMax are 1 month behind the set Dates
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log("timeMin: " + timeMin.toDateString());
      console.log("timeMax: " + timeMax.toDateString());
      console.log(`Events between ${timeMin.getMonth()}/${timeMin.getDate()}/${timeMin.getFullYear()} - ${timeMax.getMonth()}/${timeMax.getDate()}/${timeMax.getFullYear()}`);
      events.map(event => {
        const start = new Date(event.start.dateTime) || new Date(event.start.date);
        const end = new Date (event.end.dateTime) || new Date(event.end.date);
        try{
            // Assume that all Tutoring sessions contains the string "Tutoring" in event name
            if (event.summary.includes("Tutoring")) {
              sessions += getSessionString(event, start, end);
            }
        }
        catch(err) {
          console.log(err)
        }
      });
      utils.outputMonthlySessions(sessions);
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function getSessionString(event, start, end) {
  let startAmPm = " am";
  let endAmPm = " am";
  if (start.getHours() > 12) {
    let startHour = start.getHours() - 12;
    startAmPm = " pm";
  }
  if (start.getHours() == 12) {
    startAmPm = " pm";
  }
  if (end.getHours() > 12) {
    let endHour = start.getHours() - 12;
    endtAmPm = " pm";
  }
  if (start.getHours() == 12) {
    endAmPm = " pm";
  }
  return `${event.summary}!${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${startHour}:${String(start.getMinutes()).padStart(2, '0')} ${ startAmPm} - ${endHour}:${String(end.getMinutes()).padStart(2, '0')} ${ endAmPm}!${utils.getSessionDifference(start, end)}\n`;
  //return `${event.summary}!${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}!${utils.getSessionDifference(start, end)}\n`;
}

listEvents()

module.exports = {listEvents}