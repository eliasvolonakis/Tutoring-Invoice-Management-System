const credentials = require('./../credentials');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

let date = new Date();
const current_date = date.toLocaleString('default', { month: 'long' });

console.log("CLIENT_ID: " + credentials["CLIENT_ID"]);
console.log("CLIENT_SECRET: " + credentials["CLIENT_SECRET"]);
console.log("CLIENT_REDIRECT_URI: " + credentials["REDIRECT_URI"]);
console.log("REFRESH_TOKEN: " + credentials["REFRESH_TOKEN"]);

const oAuth2Client = new google.auth.OAuth2(credentials["CLIENT_ID"], credentials["CLIENT_SECRET"], credentials["REDIRECT_URI"]);

oAuth2Client.setCredentials({refresh_token: credentials["REFRESH_TOKEN"]})

async function sendEmail(subject, body, recipient) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        console.log(accessToken.token);
        const transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: 'OAuth2'
          }
        });
        
        const mailOptions = {
          from: credentials["OWNER_EMAIL"],
          to: recipient,
          subject: subject,
          text: body,
          auth: {
            user: credentials["OWNER_EMAIL"],
            accessToken: accessToken.token
          }
        }
    
        const result = await transport.sendMail(mailOptions);
        console.log("Email sent successfully with messageID:" + result.messageId + " and response " + result.response);
        return result; 
      } catch (error) {
        console.log(error.stack);  
        return error;
      }
}

sendEmail('Test Subject', 'Test Body', 'envolonakis@gmail.com');

module.exports = {sendEmail}