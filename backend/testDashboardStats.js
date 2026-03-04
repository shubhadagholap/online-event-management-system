const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'event_management'
});

console.log('Testing Dashboard Stats Logic...\n');

// Test for Admin role
console.log('=== ADMIN DASHBOARD STATS ===');
Promise.all([
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM events', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM users WHERE role = "user"', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM users WHERE role = "organizer"', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE status = "pending"', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE status = "cancelled"', (err, result) => resolve(result[0].count))),
  new Promise((resolve) => connection.query('SELECT COALESCE(SUM(total_amount), 0) as revenue FROM bookings WHERE payment_status = "paid"', (err, result) => resolve(result[0].revenue)))
]).then(([totalBookings, totalEvents, totalUsers, totalOrganizers, pendingBookings, confirmedBookings, cancelledBookings, totalRevenue]) => {
  console.log(`Total Bookings: ${totalBookings}`);
  console.log(`Total Events: ${totalEvents}`);
  console.log(`Total Users: ${totalUsers}`);
  console.log(`Total Organizers: ${totalOrganizers}`);
  console.log(`Pending Bookings: ${pendingBookings}`);
  console.log(`Confirmed Bookings: ${confirmedBookings}`);
  console.log(`Cancelled Bookings: ${cancelledBookings}`);
  console.log(`Total Revenue: $${totalRevenue}`);
  
  // Test for specific organizer (John Organizer - ID 2)
  console.log('\n=== ORGANIZER DASHBOARD STATS (John Organizer) ===');
  const organizerId = 2;
  
  Promise.all([
    new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM events WHERE organizer_id = ?', [organizerId], (err, result) => resolve(result[0].count))),
    new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ?', [organizerId], (err, result) => resolve(result[0].count))),
    new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.status = "pending"', [organizerId], (err, result) => resolve(result[0].count))),
    new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.status = "confirmed"', [organizerId], (err, result) => resolve(result[0].count))),
    new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.status = "cancelled"', [organizerId], (err, result) => resolve(result[0].count))),
    new Promise((resolve) => connection.query('SELECT COALESCE(SUM(b.total_amount), 0) as revenue FROM bookings b JOIN events e ON b.event_id = e.id WHERE e.organizer_id = ? AND b.payment_status = "paid"', [organizerId], (err, result) => resolve(result[0].revenue)))
  ]).then(([myEvents, myBookings, myPendingBookings, myConfirmedBookings, myCancelledBookings, myRevenue]) => {
    console.log(`My Events: ${myEvents}`);
    console.log(`Total Bookings: ${myBookings}`);
    console.log(`Pending Bookings: ${myPendingBookings}`);
    console.log(`Confirmed Bookings: ${myConfirmedBookings}`);
    console.log(`Cancelled Bookings: ${myCancelledBookings}`);
    console.log(`Total Revenue: $${myRevenue}`);
    
    // Test for specific user (Jyoti - ID 9)
    console.log('\n=== USER DASHBOARD STATS (Jyoti - ID 9) ===');
    const userId = 9;
    
    Promise.all([
      new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE user_id = ?', [userId], (err, result) => resolve(result[0].count))),
      new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = "pending"', [userId], (err, result) => resolve(result[0].count))),
      new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = "confirmed"', [userId], (err, result) => resolve(result[0].count))),
      new Promise((resolve) => connection.query('SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND status = "cancelled"', [userId], (err, result) => resolve(result[0].count))),
      new Promise((resolve) => connection.query('SELECT COALESCE(SUM(total_amount), 0) as spending FROM bookings WHERE user_id = ? AND payment_status = "paid"', [userId], (err, result) => resolve(result[0].spending)))
    ]).then(([myBookings, myPendingBookings, myConfirmedBookings, myCancelledBookings, mySpending]) => {
      console.log(`Total Bookings: ${myBookings}`);
      console.log(`Pending Bookings: ${myPendingBookings}`);
      console.log(`Confirmed Bookings: ${myConfirmedBookings}`);
      console.log(`Cancelled Bookings: ${myCancelledBookings}`);
      console.log(`Total Spending: $${mySpending}`);
      
      connection.end();
    });
  });
});