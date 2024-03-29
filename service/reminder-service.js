// Grab Tutoring Events from current day
// For each Tutoring Event
// Create a Reminder Email Body and Send Reminder Email

const credentials = require('./../credentials');
const utils = require('./../utils/utils.js');
const { google } = require('googleapis');
const CREDENTIALS = credentials["CALENDAR_CREDENTIALS"];
const CALENDAR_ID = credentials["CALENDAR_ID"];
const ZOOM_LINK = credentials["ZOOM_LINK"];
const OWNER_EMAIL = credentials["OWNER_EMAIL"];
const emailService = require('./email-service');


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

var timeMin = new Date(new Date().setHours(0,0,0,0));
var timeMax = new Date(new Date().setHours(24,0,0,0));
var today_sessions = [];
console.log("Today: " + timeMin.toDateString());
console.log("TimeMin:" + timeMin.toISOString());
console.log("TimeMax:" + timeMax.toISOString());

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
                today_sessions.push(getEmailData(event, start, end));
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

function createEmail(firstName, timeDifference) {
  let greeting = getGreeting();
  email = { "subject": `Tutoring Session Reminder ${timeDifference}}}`,
            "body" : `${greeting} ${firstName}!\n\nI'll see you today for our tutoring session at ${timeDifference}!\n
                      Please use the zoom link below: \n${ZOOM_LINK} \n\nThanks,\nElias`
          }
  console.log(`Subject: ${email.subject}`);
  console.log(`Body: ${email.body}`);
  return email
}

function getGreeting() {
  let greeting = "Good evening";
  let today = new Date();
  if (today.getHours() < 12) {
    greeting = "Good morning";
  } else if (today.getHours() < 18 && today.getHours() > 12) {
    greeting = "Good afternoon";
  }
  return greeting;
}

function getEmailData(event, start, end) {
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
  let emailData = {
    firstName : event.summary.split(' ')[0],
    timeDifference : `${startHour}:${String(start.getMinutes()).padStart(2, '0')}${startAmPm} - ${endHour}:${String(end.getMinutes()).padStart(2, '0')}${endAmPm}`
  }
  console.log(emailData); 
  return emailData;
}

// Call sendMail
function createAndSendReminders() 
{
  today_sessions.forEach(session => {
    email = createEmail(session.firstName, session.timeDifference)
    //await emailService.sendEmail(email["subject"], email["body"], utils.getEmailByFirstName(firstName))
    emailService.sendEmail(email["subject"], email["body"], OWNER_EMAIL)
  });
}

// let getDailySessionsPromise = new Promise((resolve, reject) => {
//   resolve(getDailySessions());
// });

getDailySessions();
setTimeout(todaySessions, 3000)

function todaySessions () {
  console.log("Today's Sessions: " + today_sessions);
  createAndSendReminders();
}
