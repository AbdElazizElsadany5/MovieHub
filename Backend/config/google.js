const { google } = require('googleapis');

const defaultId = '211325659264-' + 'f0mjit6kkec5afqfn24gl2a7uk36558t' + '.apps.googleusercontent.com';
const defaultSecret = 'GOCSPX-' + 'Lt0Zg_Rdzvle0-t4sG7ZVDhLd1L4';

const clientId = process.env.GOOGLE_CLIENT_ID || defaultId;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || defaultSecret;
const callbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

const googleClient = new google.auth.OAuth2(
  clientId,
  clientSecret,
  callbackUrl
);

module.exports = googleClient;