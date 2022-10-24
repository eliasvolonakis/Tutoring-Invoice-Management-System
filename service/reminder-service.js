// Grab Tutoring Events from current day
// For each Tutoring Event
// Create a Reminder Email Body and Send Reminder Email

const credentials = require('./../credentials');
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

var today = new Date();
console.log("Today: " + date.toDateString());
var timeMin = new Date(date.getFullYear(), date.getMonth(), 1);
var timeMax = today.setDate(today.getDate() + 1)
let today_sessions = [];

function getDailySessions() {
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
        console.log("Collecting All Tutoring Sessions for: " + timeMin.toDateString());
        events.map(event => {
          const start = new Date(event.start.dateTime) || new Date(event.start.date);
          const end = new Date (event.end.dateTime) || new Date(event.end.date);
          try{
              // Assume that all Tutoring sessions contains the string "Tutoring" in event name
              if (event.summary.includes("Tutoring")) {
                today_sessions.append(utils.getSessionStringNew(event, start, end));
              }
          }
          catch(err) {
            console.log(err)
          }
        });
      } else {
        console.log('No events found.');
      }
    });
  }
  
  // Create Logic for Creating and Emailing the Reminders