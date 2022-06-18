const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

let date = new Date();
const current_date = date.toLocaleString('default', { month: 'long' });
const subject = current_date + " Invoice";

console.log("CLIENT_ID: " + process.env.CLIENT_ID);
console.log("CLIENT_SECRET: " + process.env.CLIENT_SECRET);
console.log("CLIENT_REDIRECT_URI: " + process.env.REDIRECT_URI);
console.log("REFRESH_TOKEN: " + process.env.REFRESH_TOKEN);

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
console.log("oAuth2Client: " + oAuth2Client);

oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

async function sendMail() {
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
          from: process.env.OWNER_EMAIL,
          to: 'envolonakis@gmail.com',
          subject: subject,
          text: "Good morning, \n \n Attached to this email is STUDENTS tutoring invoice for all " + current_date + " tutoring sessions. Whenever it's convenient for you, please complete the payment via e-transfer to this email address",
          //html: "<p>Good morning,</p> <p>Attached to this email is STUDENTS tutoring invoice for all " + current_date + " tutoring sessions. Whenever it's convenient for you, please complete the payment via e-transfer to this email address. </p>",
          auth: {
            user: process.env.OWNER_EMAIL,
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

    
sendMail()