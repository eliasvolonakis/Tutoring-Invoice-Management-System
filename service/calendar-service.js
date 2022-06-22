const { google } = require('googleapis');
require('dotenv').config();
const fs = require('fs');
const sessionsPath = '/Users/elias_volonakis/Tutoring-Invoice-Management-System/sessions.txt';
const SESSIONS_PATH = process.env.SESSIONS_PATH;
const CREDENTIALS = JSON.parse(process.env.CALENDAR_CREDENTIALS);
const CALENDAR_ID = process.env.CALENDAR_ID;

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
const timeMin = new Date(2022, 6, 01);
const timeMax = new Date(2022, 8, 30);

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
    console.log("Beginning list Events")
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log(`Events between ${timeMin.toISOString()} - ${timeMax.toISOString()}`);
      events.map(event => {
        const start = new Date(event.start.dateTime) || new Date(event.start.date);
        const end = new Date (event.end.dateTime) || new Date(event.end.date);
        try{
          sessions += `${event.summary}: ${start.toLocaleString('default', { month: 'long' })} ${start.getDate()}, ${start.getFullYear()}: ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} - ${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')} \n`;
          console.log(sessions);
        }
        catch(err) {
          console.log(err)
        }
      });
      outputMonthlySessions(sessions);
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function outputMonthlySessions(content) {
  fs.writeFile(SESSIONS_PATH, content, err => {
    if (err) {
      console.error(err)
    }
  });
}

listEvents()