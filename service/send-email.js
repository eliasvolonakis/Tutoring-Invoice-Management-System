const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

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
          from: 'envolonakis@gmail.com',
          to: 'envolonakis@gmail.com',
          subject: "Test Email API Subject",
          text: "Test Email API Text",
          html: "<h1> Test Email API HTML </h1>",
          auth: {
            user: process.env.OWNER_EMAIL,
            accessToken: accessToken.token
          }
        }
    
        const result = await transport.sendMail(mailOptions);
        return result;
        console.log("Email sent successfully with messageID:" + result.messageId + " and response " + result.response); 
      } catch (error) {
        console.log(error.stack);  
        return error;
      }
}

    
sendMail()