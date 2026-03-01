const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Testing Organizer Stats for prerana (ID 4)...\n');

const organizerId = 4; // prerana

Promise.all([
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM events WHERE organizer_id = ?', [organizerId], (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ?', [organizerId], (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.status = "pending"', [organizerId], (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.status = "confirmed"', [organizerId], (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.status = "cancelled"', [organizerId], (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COALESCE(SUM(b.total_amount), 0) as revenue FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.payment_status = "paid"', [organizerId], (err, result) => resolve(result[0].revenue)))
]).then(([myEvents, myBookings, myPendingBookings, myConfirmedBookings, myCancelledBookings, myRevenue]) => {
  console.log('=== ORGANIZER DASHBOARD STATS (prerana - ID 4) ===');
  console.log(`My Events: ${myEvents}`);
  console.log(`Total Bookings: ${myBookings}`);
  console.log(`Pending Bookings: ${myPendingBookings}`);
  console.log(`Confirmed Bookings: ${myConfirmedBookings}`);
  console.log(`Cancelled Bookings: ${myCancelledBookings}`);
  console.log(`Total Revenue: $${myRevenue}`);
  
  connection.end();
});