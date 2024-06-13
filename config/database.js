const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the MongoDB database');
  } catch (err) {
    console.error('Failed to connect to the MongoDB database', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectToDatabase;