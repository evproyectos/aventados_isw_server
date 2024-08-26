// Load Twilio account SID and authentication token from environment variables
const accountSid = process.env.ACCOUNT_SID;
const accountToken = process.env.ACCOUNT_TOKEN;

// Initialize the Twilio client with the provided credentials
const client = require('twilio')(accountSid, accountToken);

/**
 * Sends an SMS message using the Twilio API.
 * 
 * @param {string} destinationNumber - The recipient's phone number.
 * @param {string} body - The content of the SMS message.
 * @returns {Promise<void>} - A promise that resolves when the message is sent, or logs an error if it fails.
 */
const sendSMS = async (destinationNumber, body) => {
    // Define the message options, including the sender's number, recipient's number, and message body
    let msgOptions = {
        from: process.env.TWILIO_NUMBER, // The Twilio phone number sending the SMS
        to: destinationNumber,           // The recipient's phone number
        body                             // The message content
    };
    
    try {
        // Attempt to send the SMS message using the Twilio client
        const message = await client.messages.create(msgOptions);
        console.log(message); // Log the message details if successful
    } catch (error) {
        console.error(error); // Log any errors that occur during the process
    }
};

// Export the sendSMS function for use in other modules
module.exports = { sendSMS };
