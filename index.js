const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');
require('dotenv').config();
const { PORT } = require('./config');
const redisConfig = {
  socket: {
    host: process.env.redis_host,
    port: process.env.redis_port,
  },
};
const router = require('./src/routes');
const app = express();

global.redisClient = createClient(redisConfig);
redisClient.connect();

app.use(cors());
app.use(express.json());

app.use('/', router);

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server running successfully at port ${PORT}`);
  } else {
    console.log('Error occurred! Server failed to run');
  }
});
