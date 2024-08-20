require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const accountToken = process.env.ACCOUNT_TOKEN;

const client = require('twilio')(accountSid,accountToken);

const sendSMS = async (body,destinationNumber) => {
    let msgOptions = {
        from: process.env.TWILIO_NUMBER,
        to: destinationNumber,
        body
    }
    try {
        const message = await client.messages.create(msgOptions);
        console.log(message);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { sendSMS };