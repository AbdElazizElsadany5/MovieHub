const { google } = require('googleapis');

const defaultId = Buffer.from('MjExMzI1NjU5MjY0LWYwbWppdDZra2VjNWFmcWZuMjRnbDJhN3VrMzY1NTh0LmFwcHMuZ29vZ2xldXNlcmludGVyZmFjZS5jb20=', 'base64').toString('ascii');
const defaultSecret = Buffer.from('R09DU1BYLUx0MFpnX1JkenZsZTAtdDRzRzdaVkRoTGQxTDQ=', 'base64').toString('ascii');

const clientId = process.env.GOOGLE_CLIENT_ID || defaultId;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || defaultSecret;
const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

const googleClient = new google.auth.OAuth2(
  clientId,
  clientSecret,
  callbackUrl
);

module.exports = googleClient;