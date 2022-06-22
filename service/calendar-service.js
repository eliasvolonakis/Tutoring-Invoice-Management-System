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
      // for (let event of events) {
      //   const start = event.start.dateTime || event.start.date;
      //   const end = event.end.dateTime || event.end.date;
      //   outputMonthlySessions(`${event.summary}: ${start} - ${end} \n`);
      // }
      events.map(event => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        sessions += `${event.summary}: ${start} - ${end} \n`;
        //outputMonthlySessions(`${event.summary}: ${start} - ${end} \n`);
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