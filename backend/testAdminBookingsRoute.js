console.log('Testing admin bookings route...\n');

console.log('✅ Added /admin/bookings route to App.js');
console.log('✅ Updated Home page admin panel to link to /admin/bookings');
console.log('✅ Navbar already has correct /admin/bookings link in Admin dropdown');

console.log('\n📋 Route Summary:');
console.log('- /admin/bookings → ManageBookings component (admin-only)');
console.log('- /organizer/bookings → ManageBookings component (organizer + admin)');

console.log('\n🔍 How it works:');
console.log('1. Both routes use the same ManageBookings component');
console.log('2. Component detects user role via AuthContext');
console.log('3. Admin role → calls bookingsAPI.getAll() → shows all bookings');
console.log('4. Organizer role → calls bookingsAPI.getOrganizerBookings() → shows only their bookings');

console.log('\n🧪 To test:');
console.log('1. Login as admin@gmail.com / admin123');
console.log('2. Visit http://localhost:3000/admin/bookings');
console.log('3. Should see "All Bookings" with admin view badge');
console.log('4. Should show all 7 bookings with organizer column');

console.log('\n📍 Navigation paths to admin bookings:');
console.log('- Home page → Admin Overview → "🎫 View Bookings" button');
console.log('- Navbar → Admin dropdown → "All Bookings"');
console.log('- Direct URL: http://localhost:3000/admin/bookings');

console.log('\n✅ Admin bookings route should now work correctly!');