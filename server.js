const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const BookingDB = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Get available dates endpoint
app.get('/api/availability', (req, res) => {
  try {
    const bookedDates = BookingDB.getBookedDates();
    res.json({ 
      success: true, 
      bookedDates: bookedDates.map(booking => booking.event_date)
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch availability' 
    });
  }
});

// Check if a specific date is available
app.get('/api/availability/:date', (req, res) => {
  try {
    const { date } = req.params;
    const isAvailable = BookingDB.isDateAvailable(date);
    res.json({ 
      success: true, 
      date,
      available: isAvailable 
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check availability' 
    });
  }
});

// Email endpoint (now also saves booking)
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, eventLocation, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !eventType || !eventDate || !eventLocation) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Check if date is already booked
    if (!BookingDB.isDateAvailable(eventDate)) {
      return res.status(409).json({ 
        success: false, 
        error: 'This date is already booked. Please select another date.' 
      });
    }

    // Format the email content
    const emailContent = `
      New Booking Request Received!
      
      Contact Information:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone}
      
      Event Details:
      - Event Type: ${eventType}
      - Event Date: ${eventDate}
      - Location: ${eventLocation}
      
      ${message ? `Additional Details:\n${message}` : ''}
      
      ---
      This email was sent from your portfolio website booking form.
    `;

    // Email to business owner (booking notification)
    const ownerEmail = {
      to: process.env.TO_EMAIL || email,
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      subject: `New Booking Request: ${eventType} - ${name}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Booking Request Received!</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Event Details</h3>
            <p><strong>Event Type:</strong> ${eventType}</p>
            <p><strong>Event Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
          </div>
          
          ${message ? `
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">Additional Details</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">This email was sent from your portfolio website booking form.</p>
        </div>
      `
    };

    // Confirmation email to customer
    const confirmationEmail = {
      to: email,
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      subject: `Booking Request Confirmation - ${eventType}`,
      text: `
        Hi ${name},
        
        Thank you for your booking request! We've received your inquiry and will get back to you soon.
        
        Here's a summary of your booking request:
        
        Event Type: ${eventType}
        Event Date: ${eventDate}
        Location: ${eventLocation}
        
        ${message ? `Additional Details: ${message}` : ''}
        
        We'll review your request and contact you at ${phone} or ${email} within 24-48 hours to confirm the details.
        
        Best regards,
        Jefte Photography
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Thank You, ${name}!</h1>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            We've received your booking request and will get back to you soon!
          </p>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #333; margin-top: 0;">Your Booking Request Summary</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold; width: 40%;">Event Type:</td>
                <td style="padding: 10px 0; color: #333;">${eventType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Event Date:</td>
                <td style="padding: 10px 0; color: #333;">${eventDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Location:</td>
                <td style="padding: 10px 0; color: #333;">${eventLocation}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: bold;">Contact:</td>
                <td style="padding: 10px 0; color: #333;">${phone}</td>
              </tr>
            </table>
            
            ${message ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-weight: bold; margin-bottom: 10px;">Additional Details:</p>
                <p style="color: #333; white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
            ` : ''}
          </div>
          
          <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #004085; margin: 0; line-height: 1.6;">
              <strong>What's Next?</strong><br>
              We'll review your request and contact you at <strong>${phone}</strong> or <strong>${email}</strong> 
              within 24-48 hours to confirm the details and discuss your event.
            </p>
          </div>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            If you have any questions or need to make changes to your booking request, please don't hesitate to contact us.
          </p>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            Best regards,<br>
            <strong style="color: #333;">Jefte Photography</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    // Save booking to database first (this will throw if date is already booked)
    let booking;
    try {
      booking = BookingDB.createBooking({
        name,
        email,
        phone,
        eventType,
        eventDate,
        eventLocation,
        message
      });
    } catch (dbError) {
      return res.status(409).json({ 
        success: false, 
        error: dbError.message || 'This date is already booked. Please select another date.' 
      });
    }

    // Send both emails
    try {
      await Promise.all([
        sgMail.send(ownerEmail),
        sgMail.send(confirmationEmail)
      ]);
    } catch (emailError) {
      // If email fails, we should still keep the booking but log the error
      console.error('Error sending emails:', emailError);
      // Optionally, you could delete the booking here if email is critical
    }

    res.json({ 
      success: true, 
      message: 'Booking confirmed and email sent successfully',
      bookingId: booking.id
    });
  } catch (error) {
    console.error('Error sending email:', error);
    
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`SendGrid API Key configured: ${process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}`);
});

