# SendGrid Integration Setup

## ✅ Implementation Complete

The SendGrid API has been successfully integrated into your booking form. Here's what was set up:

### What's Been Done:

1. ✅ Installed `@sendgrid/mail` package
2. ✅ Created Express backend server (`server.js`)
3. ✅ Set up environment variables (`.env` file)
4. ✅ Updated BookingForm to send emails via API
5. ✅ Added error handling and user feedback

### Important: Configure Your Email Settings

**You MUST update the `.env` file with your actual email addresses:**

1. Open the `.env` file in the root directory
2. Update `FROM_EMAIL` with a **verified sender email** in SendGrid
   - This email must be verified in your SendGrid account
   - Go to SendGrid Dashboard → Settings → Sender Authentication
3. Update `TO_EMAIL` with the email where you want to receive booking requests

### How to Run:

#### Option 1: Run Both Server and React App (Recommended)
```bash
npm run dev
```
This will start both the backend server (port 3001) and React app (port 3000) simultaneously.

#### Option 2: Run Separately
Terminal 1 - Backend Server:
```bash
npm run server
```

Terminal 2 - React App:
```bash
npm start
```

### Testing:

1. Start the server and React app
2. Navigate to the booking form on your website
3. Fill out and submit the form
4. Check your email inbox (the `TO_EMAIL` address) for the booking request

### API Endpoint:

- **POST** `http://localhost:3001/api/send-email`
- Accepts JSON with: `name`, `email`, `phone`, `eventType`, `eventDate`, `eventLocation`, `message`

### Security Notes:

- ✅ API key is stored in `.env` file (not committed to git)
- ✅ `.env` is in `.gitignore` to prevent accidental commits
- ✅ Backend handles email sending (API key never exposed to frontend)

### Troubleshooting:

**Email not sending?**
- Verify your SendGrid API key is correct
- Ensure `FROM_EMAIL` is verified in SendGrid
- Check server console for error messages
- Verify SendGrid account has sending permissions enabled

**CORS errors?**
- Make sure the backend server is running on port 3001
- Check that the React app is making requests to `http://localhost:3001`

**Production Deployment:**
- Set environment variables on your hosting platform
- Update the API endpoint URL in `BookingForm.js` to your production backend URL
- Ensure your backend server is accessible from your frontend domain

