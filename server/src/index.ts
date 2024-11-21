import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import dialogflow from '@google-cloud/dialogflow';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;

// Ensure necessary environment variables are loaded
const projectId = process.env.GOOGLE_PROJECT_ID;
const sessionId = process.env.DIALOGFLOW_SESSION_ID;

if (!projectId || !sessionId) {
  // Debugging: Highlight missing environment variables
  throw new Error("GOOGLE_PROJECT_ID and DIALOGFLOW_SESSION_ID must be set in .env file");
}

// Initialize Dialogflow Session Client
const sessionClient = new dialogflow.SessionsClient();
// Change: Corrected method to construct the session path
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// Set up WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming chat messages from client
  socket.on("chat message", async (text) => {
    console.log("Message received:", text);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: "en-US",
        },
      },
    };

    try {
      // Change: Destructured the Dialogflow response array for clarity
      const [response] = await sessionClient.detectIntent(request);

      // Debugging: Added check for response existence and detailed logging
      if (response.queryResult) {
        const result = response.queryResult;
        if (result.fulfillmentText) {
          console.log("Bot reply:", result.fulfillmentText);
          socket.emit("bot reply", result.fulfillmentText);
        } else {
          console.log("No fulfillment text found");
          socket.emit("bot reply", "I'm not sure how to respond to that.");
        }
      } else {
        console.error("No queryResult in Dialogflow response");
        socket.emit("bot reply", "Something went wrong. Please try again.");
      }
    } catch (error) {
      // Debugging: Enhanced error logging
      console.error("Dialogflow API error:", error.message, error.stack);
      socket.emit("bot reply", "Error occurred while processing your request.");
    }
  });

  // Debugging: Logs user disconnection events
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
