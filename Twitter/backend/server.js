// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("Database Connected!")
});

app.use('/api/users', require('./routes/users'));
app.use('/api/tweets', require('./routes/tweets'));

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port 8000');
});

