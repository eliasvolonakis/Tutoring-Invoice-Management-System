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

// Replace later with specific times 
const timeMin = new Date(2022, 7, 1);
const timeMax = new Date(2022, 7, 14);

// Replace above with this for first and last day of month
// var date = new Date();
// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

let sessions = "";

function listEvents() {
  calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log(`Events between ${timeMin.getMonth()}/${timeMin.getDate()}/${timeMin.getFullYear()} - ${timeMax.getMonth()}/${timeMax.getDate()}/${timeMax.getFullYear()}`);
      events.map(event => {
        const start = new Date(event.start.dateTime) || new Date(event.start.date);
        const end = new Date (event.end.dateTime) || new Date(event.end.date);
        try{
            // Assume that all Tutoring sessions contains the string "Tutoring" in event name
            if (event.summary.includes("Tutoring")) {
              console.log(utils);
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
  return `${event.summary}!${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}!${utils.getSessionDifference(start, end)}\n`;
}

listEvents()
