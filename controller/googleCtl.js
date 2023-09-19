const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

// Initialize the Google Calendar API client
const calendar = google.calendar({
  version: "v3",
});

// Initialize the OAuth2 client with credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost:8000/google/redirect"
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

// Redirect users to the Google OAuth2 consent screen
const calendarEvent = (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).send("Error generating auth URL");
  }
};

// Function to retrieve the refresh token from the environment variable
const getRefreshToken = () => {
  return process.env.REFRESH_TOKEN;
};

// Create an event in the user's Google Calendar
const scheduleEvent = async (req, res) => {
  try {
    const { start, end, calendarId, summary, description } = req.body;

    // Ensure the user is authenticated and tokens are available
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.log("Authentication required.");
    }

    // Use the stored refresh token to obtain a new access token
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Set the new access token
    oauth2Client.setCredentials(credentials);

    // Set the start and end times for the event
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + 8);

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 19);

    // Specify the time zone as "Africa/Nairobi" for Nairobi, Kenya
    const timeZone = "Africa/Nairobi";

    // Create the event in the user's primary calendar
    const event = await calendar.events.insert({
      calendarId: calendarId,
      auth: oauth2Client,
      requestBody: {
        summary: summary,
        description: description,
        start: {
          dateTime: start,
          timeZone: timeZone,
        },
        end: {
          dateTime: end,
          timeZone: timeZone,
        },
      },
    });

    console.log("Event created: %s", event.data.htmlLink);
    res.send("Event created: " + event.data.htmlLink);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Error creating event");
  }
};

// Get a list of events from the user's Google Calendar
const getCalendarEvents = async (req, res) => {
  try {
    // Ensure the user is authenticated and tokens are available
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.log("Authentication required.");
    }

    // Use the stored refresh token to obtain a new access token
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Set the new access token
    oauth2Client.setCredentials(credentials);

    // Fetch a list of events from the user's primary calendar
    const response = await calendar.events.list({
      calendarId: "primary",
      auth: oauth2Client,
    });

    const events = response.data.items;
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Error fetching events");
  }
};
// Handle the OAuth2 redirect and store the refresh token securely
const redirect = async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);

    res.send("Success! You can now access the Google Calendar.");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Error exchanging code for tokens");
  }
};

module.exports = {
  calendarEvent,
  scheduleEvent,
  redirect,
  getCalendarEvents,
};
