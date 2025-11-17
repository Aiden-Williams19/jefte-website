const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'bookings.db');
const db = new Database(dbPath);

// Create bookings table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_location TEXT NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    UNIQUE(event_date)
  );

  CREATE INDEX IF NOT EXISTS idx_event_date ON bookings(event_date);
`);

// Database operations
const BookingDB = {
  // Check if a date is available
  isDateAvailable: (date) => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE event_date = ? AND status != ?');
    const result = stmt.get(date, 'cancelled');
    return result.count === 0;
  },

  // Get all booked dates
  getBookedDates: () => {
    const stmt = db.prepare('SELECT event_date, event_type, name FROM bookings WHERE status != ? ORDER BY event_date');
    return stmt.all('cancelled');
  },

  // Get booked dates for a date range
  getBookedDatesInRange: (startDate, endDate) => {
    const stmt = db.prepare(`
      SELECT event_date, event_type, name 
      FROM bookings 
      WHERE event_date >= ? AND event_date <= ? AND status != ?
      ORDER BY event_date
    `);
    return stmt.all(startDate, endDate, 'cancelled');
  },

  // Create a new booking
  createBooking: (bookingData) => {
    const { name, email, phone, eventType, eventDate, eventLocation, message } = bookingData;
    
    // Check if date is already booked
    if (!BookingDB.isDateAvailable(eventDate)) {
      throw new Error('This date is already booked. Please select another date.');
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (name, email, phone, event_type, event_date, event_location, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, email, phone, eventType, eventDate, eventLocation, message || '');
    return {
      id: result.lastInsertRowid,
      ...bookingData
    };
  },

  // Get booking by ID
  getBookingById: (id) => {
    const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
    return stmt.get(id);
  },

  // Get all bookings (for admin)
  getAllBookings: () => {
    const stmt = db.prepare('SELECT * FROM bookings ORDER BY event_date DESC, created_at DESC');
    return stmt.all();
  },

  // Update booking status
  updateBookingStatus: (id, status) => {
    const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
    return stmt.run(status, id);
  },

  // Delete booking (soft delete by setting status to cancelled)
  cancelBooking: (id) => {
    return BookingDB.updateBookingStatus(id, 'cancelled');
  }
};

module.exports = BookingDB;

