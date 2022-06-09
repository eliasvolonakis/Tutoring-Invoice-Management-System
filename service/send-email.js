const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

console.log("CLIENT_ID: " + process.env.CLIENT_ID);
console.log("CLIENT_SECRET: " + process.env.CLIENT_SECRET);
console.log("CLIENT_REDIRECT_URI: " + process.env.REDIRECT_URI);
console.log("REFRESH_TOKEN: " + process.env.REFRESH_TOKEN);

// const oAuth2 = google.auth.OAuth2;
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
console.log("oAuth2Client: " + oAuth2Client);

oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

async function sendMail() {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        console.log("Access Toke: " + accessToken);
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
            to: process.env.RECIPIENT,
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