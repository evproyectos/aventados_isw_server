require('dotenv').config();
const app = require('./app');
const connectToDatabase = require('./config/database');


const PORT = process.env.PORT || 3001;

// Connect to the database
connectToDatabase();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
