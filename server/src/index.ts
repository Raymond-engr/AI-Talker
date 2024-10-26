import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { SessionsClient } from '@google-cloud/dialogflow';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
  }
});

const port = process.env.PORT || 3000;

const projectId = process.env.GOOGLE_PROJECT_ID;
const sessionId = process.env.DIALOGFLOW_SESSION_ID;

if (!projectId || !sessionId) {
  throw new Error('GOOGLE_PROJECT_ID and DIALOGFLOW_SESSION_ID must be set in .env file');
}

const sessionClient = new SessionsClient();
const sessionPath = sessionClient.projectLocationAgentSessionPath(projectId, 'locations', 'global', sessionId);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (text) => {
    console.log('Message: ' + text);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'en-US',
        },
      },
    };

    try {
      const [response] = await sessionClient.detectIntent(request);
      const result = response.queryResult;
      if (result) {
        console.log('aiResponse', result.fulfillmentText);
        socket.emit('aiResponse', result.fulfillmentText);
      }
    } catch (error) {
      console.error('ERROR:', error);
      socket.emit('aiResponse', 'Error occurred while processing your request.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});