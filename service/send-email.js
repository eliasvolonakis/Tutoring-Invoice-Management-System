const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

console.log("CLIENT_ID: " + process.env.CLIENT_ID);
console.log("CLIENT_SECRET: " + process.env.CLIENT_SECRET);
console.log("CLIENT_REDIRECT_URI: " + process.env.REDIRECT_URI);
console.log("REFRESH_TOKEN: " + process.env.REFRESH_TOKEN);


async function sendMail() {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.OWNER_EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: process.env.OWNER_EMAIL,
            to: 'envolonakis@gmail.com',
            subject: "Test Email API Subject",
            text: "Test Email API Text",
            html: "<h1> Test Email API HTML </h1>"
        }

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch(error) {
        return error;
    }
}

    
sendMail().then(result => console.log("Email is sent: ", result))
.catch((error) => console.log(error.message));