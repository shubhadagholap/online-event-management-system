# ✅ Certificate Generation System - Complete Guide

## Quick Start

### 1. Setup (One-time)
```bash
setup-certificates.bat
```

This creates confirmed bookings for testing certificate generation.

### 2. Generate Certificates

#### Option A: Via Frontend (Recommended)
1. Login as organizer: `organizer@example.com` / `organizer123`
2. Navigate to "Certificates" page
3. Select an event
4. Click "Auto-Generate Certificates" button
5. Certificates will be generated for all confirmed bookings

#### Option B: Via API
```bash
POST http://localhost:5000/api/certificates/organizer/auto-generate
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
Body:
{
  "event_id": 1
}
```

## How It Works

### Certificate Generation Flow

1. **Confirmed Bookings Required**
   - Only bookings with `status = "confirmed"` get certificates
   - Each booking can only have one certificate

2. **Auto-Generation Process**
   - Finds all confirmed bookings for the event
   - Skips bookings that already have certificates
   - Generates PDF certificate for each attendee
   - Saves PDF to `backend/public/certificates/`
   - Creates database record with certificate details

3. **Certificate Contents**
   - Participant name
   - Event title
   - Event date
   - Unique certificate number (CERT-timestamp-random)
   - Professional PDF format (A4 size)

## API Endpoints

### For Organizers

#### Auto-Generate Certificates
```
POST /api/certificates/organizer/auto-generate
Auth: Required (Organizer/Admin)
Body: { "event_id": number }
Response: { "message": "X certificates generated", "count": X }
```

#### Get My Event Certificates
```
GET /api/certificates/organizer/certificates
Auth: Required (Organizer/Admin)
Response: Array of certificates for organizer's events
```

#### Get Certificate Statistics
```
GET /api/certificates/organizer/stats
Auth: Required (Organizer/Admin)
Response: { "total_certificates": X, "downloaded": Y, "pending": Z }
```

### For Users

#### Generate Single Certificate
```
POST /api/certificates
Auth: Required (User)
Body: { "booking_id": number, "event_id": number }
Response: Certificate details with PDF URL
```

#### Get My Certificates
```
GET /api/certificates
Auth: Required (User)
Response: Array of user's certificates
```

#### Download Certificate
```
POST /api/certificates/:id/download
Auth: Required (User)
Response: PDF file download
```

## Database Schema

### certificates Table
```sql
CREATE TABLE certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  pdf_url VARCHAR(255) NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  downloaded BOOLEAN DEFAULT FALSE,
  downloaded_at TIMESTAMP NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
```

## Test Data Created

### Events with Confirmed Bookings
- **Tech Summit 2026** (ID: 1) - 3 confirmed bookings
- **Rock Festival** (ID: 2) - 3 confirmed bookings
- **Marathon 2026** (ID: 3) - 3 confirmed bookings

### Test Users with Bookings
- Jane Attendee
- Test User
- sakshi

Total: 10 confirmed bookings ready for certificate generation

## Troubleshooting

### 404 Error on /api/certificates/organizer/auto-generate

**Cause:** Backend server not running or routes not loaded

**Fix:**
1. Restart backend server:
   ```bash
   cd backend
   node server.js
   ```
2. Verify routes are loaded (check console output)
3. Test health endpoint: `http://localhost:5000/api/health`

### No Certificates Generated (count: 0)

**Cause:** No confirmed bookings without certificates

**Fix:**
1. Check bookings status:
   ```bash
   cd backend
   node testCertificateGeneration.js
   ```
2. Create test bookings:
   ```bash
   node createConfirmedBookings.js
   ```
3. Verify bookings are confirmed in database

### Certificate PDF Not Found

**Cause:** PDF file not created or wrong path

**Fix:**
1. Check directory exists: `backend/public/certificates/`
2. Verify write permissions
3. Check server logs for PDF generation errors
4. Ensure PDFKit is installed: `npm install pdfkit`

### "Event not found" Error

**Cause:** Event doesn't belong to logged-in organizer

**Fix:**
1. Verify you're logged in as the correct organizer
2. Check event's `organizer_id` matches your user ID
3. Admin users can generate for any event

## Frontend Integration

### Certificate Page Component
```javascript
import { certificatesAPI } from '../services/api';

// Auto-generate certificates
const handleAutoGenerate = async (eventId) => {
  try {
    const response = await certificatesAPI.autoGenerate({ event_id: eventId });
    alert(`${response.data.count} certificates generated!`);
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to generate certificates');
  }
};

// Get organizer certificates
const fetchCertificates = async () => {
  const response = await certificatesAPI.getOrganizerCertificates();
  setCertificates(response.data);
};
```

### API Service (frontend/src/services/api.js)
```javascript
export const certificatesAPI = {
  generate: (data) => api.post('/certificates', data),
  getAll: () => api.get('/certificates'),
  getById: (id) => api.get(`/certificates/${id}`),
  download: (id) => api.post(`/certificates/${id}/download`),
  getOrganizerCertificates: () => api.get('/certificates/organizer/certificates'),
  autoGenerate: (data) => api.post('/certificates/organizer/auto-generate', data),
  getStats: () => api.get('/certificates/organizer/stats'),
};
```

## Security Notes

1. **Authentication Required**
   - All endpoints require valid JWT token
   - Organizers can only generate for their own events
   - Users can only access their own certificates

2. **Authorization Checks**
   - Event ownership verified before generation
   - Booking ownership verified before download
   - Admin role can access all certificates

3. **File Security**
   - PDFs stored in public directory (accessible via URL)
   - Unique certificate numbers prevent guessing
   - Download tracking in database

## Performance Tips

1. **Batch Generation**
   - Auto-generate processes all bookings at once
   - Small delay between PDFs to ensure unique timestamps
   - Async PDF generation with Promise handling

2. **Database Optimization**
   - Index on certificate_number for fast lookups
   - Foreign keys for data integrity
   - Efficient queries with JOINs

3. **File Management**
   - PDFs stored with unique names
   - Directory created automatically if missing
   - Consider cleanup of old certificates

## Next Steps

1. **Enhance PDF Design**
   - Add event logo/branding
   - Include QR code for verification
   - Custom templates per event type

2. **Email Integration**
   - Auto-send certificates to attendees
   - Email notification when generated
   - Resend certificate option

3. **Verification System**
   - Public certificate verification page
   - QR code scanning
   - Certificate authenticity check

## Summary

The certificate generation system is now fully functional:
- ✅ 10 confirmed bookings created for testing
- ✅ Auto-generation API working
- ✅ PDF generation with PDFKit
- ✅ Database tracking and statistics
- ✅ Organizer and user endpoints
- ✅ Download functionality

Login as organizer and start generating certificates!
