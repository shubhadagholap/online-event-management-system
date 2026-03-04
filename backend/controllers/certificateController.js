const db = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


// Generate certificate for attendee
exports.generateCertificate = async (req, res) => {
  try {
    const { booking_id, event_id } = req.body;
    const user_id = req.user.id;

    // Check if booking exists and is confirmed
    const [booking] = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = "confirmed"',
      [booking_id, user_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not confirmed' });
    }

    // Check if certificate already exists
    const [existing] = await db.query(
      'SELECT id FROM certificates WHERE booking_id = ? AND user_id = ?',
      [booking_id, user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Certificate already generated' });
    }

    // Get user and event details
    const [user] = await db.query('SELECT name FROM users WHERE id = ?', [user_id]);
    const [event] = await db.query('SELECT title, date FROM events WHERE id = ?', [event_id]);

    if (user.length === 0 || event.length === 0) {
      return res.status(404).json({ message: 'User or event not found' });
    }

    // Generate certificate number
    const certificate_number = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Generate PDF file using PDFKit
    const certDir = path.join(__dirname, '..', 'public', 'certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    const filePath = path.join(certDir, `${certificate_number}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(25).text('Certificate of Participation', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(18).text(`This certifies that`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(22).text(user[0].name, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(18).text(`has successfully participated in the event`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(event[0].title, { align: 'center', italic: true });
    doc.moveDown(2);
    doc.fontSize(14).text(`Event Date: ${new Date(event[0].date).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(4);
    doc.fontSize(12).text(`Certificate Number: ${certificate_number}`, { align: 'right' });
    doc.end();

    // url path for frontend
    const pdf_url = `/certificates/${certificate_number}.pdf`;

    // Create certificate record
    const [result] = await db.query(
      `INSERT INTO certificates (booking_id, user_id, event_id, certificate_number, pdf_url)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, user_id, event_id, certificate_number, pdf_url]
    );

    res.status(201).json({
      message: 'Certificate generated successfully',
      certificateId: result.insertId,
      certificate_number,
      pdf_url,
      participant_name: user[0].name,
      event_title: event[0].title,
      event_date: event[0].date
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user certificates
exports.getUserCertificates = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [certificates] = await db.query(
      `SELECT c.*, e.title as event_title, e.date as event_date FROM certificates c
       JOIN events e ON c.event_id = e.id
       WHERE c.user_id = ?
       ORDER BY c.issued_at DESC`,
      [user_id]
    );

    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate details
exports.getCertificate = async (req, res) => {
  try {
    const certificateId = req.params.id;
    const user_id = req.user.id;

    const [certificate] = await db.query(
      `SELECT c.*, e.title as event_title, e.date as event_date, u.name as participant_name
       FROM certificates c
       JOIN events e ON c.event_id = e.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ? AND c.user_id = ?`,
      [certificateId, user_id]
    );

    if (certificate.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate[0]);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Download certificate PDF
exports.downloadCertificate = async (req, res) => {
  try {
    const certificateId = req.params.id;
    const user_id = req.user.id;

    const [certificate] = await db.query(
      'SELECT * FROM certificates WHERE id = ? AND user_id = ?',
      [certificateId, user_id]
    );

    if (certificate.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Update download status
    await db.query(
      'UPDATE certificates SET downloaded = TRUE, downloaded_at = NOW() WHERE id = ?',
      [certificateId]
    );

    // Serve the actual PDF file
    const filePath = path.join(__dirname, '..', 'public', certificate[0].pdf_url);
    res.download(filePath, `${certificate[0].certificate_number}.pdf`, (err) => {
      if (err) {
        console.error('Error sending file', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get organizer certificates (all certificates for their events)
exports.getOrganizerCertificates = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const [certificates] = await db.query(
      `SELECT c.*, e.title as event_title, u.name as participant_name
       FROM certificates c
       JOIN bookings b ON c.booking_id = b.id
       JOIN events e ON c.event_id = e.id
       JOIN users u ON c.user_id = u.id
       WHERE e.organizer_id = ?
       ORDER BY c.issued_at DESC`,
      [organizer_id]
    );

    res.json(certificates);
  } catch (error) {
    console.error('Get organizer certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auto-generate certificates for completed events (Admin/Organizer)
exports.autoGenerateCertificates = async (req, res) => {
  try {
    const { event_id } = req.body;
    const organizer_id = req.user.id;

    // Verify event belongs to organizer
    const [event] = await db.query(
      'SELECT * FROM events WHERE id = ? AND organizer_id = ?',
      [event_id, organizer_id]
    );

    if (event.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get all confirmed bookings for this event
    const [bookings] = await db.query(
      `SELECT b.*, u.name as user_name FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.event_id = ? AND b.status = "confirmed"
       AND b.id NOT IN (SELECT booking_id FROM certificates WHERE event_id = ?)`,
      [event_id, event_id]
    );

    if (bookings.length === 0) {
      return res.json({ message: 'No confirmed bookings without certificates', count: 0 });
    }

    // Ensure certificates directory exists
    const certDir = path.join(__dirname, '..', 'public', 'certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }

    let generatedCount = 0;

    for (const booking of bookings) {
      const certificate_number = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${certificate_number}.pdf`;
      const filePath = path.join(certDir, fileName);

      // Generate PDF
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.fontSize(25).text('Certificate of Participation', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(18).text(`This certifies that`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(22).text(booking.user_name, { align: 'center', underline: true });
      doc.moveDown();
      doc.fontSize(18).text(`has successfully participated in the event`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(20).text(event[0].title, { align: 'center', italic: true });
      doc.moveDown(2);
      try {
        const evDate = event[0].date ? new Date(event[0].date).toLocaleDateString() : '';
        doc.fontSize(14).text(`Event Date: ${evDate}`, { align: 'center' });
      } catch (e) {}
      doc.moveDown(4);
      doc.fontSize(12).text(`Certificate Number: ${certificate_number}`, { align: 'right' });
      doc.end();

      // Wait for PDF write to complete
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const pdf_url = `/certificates/${fileName}`;

      await db.query(
        `INSERT INTO certificates (booking_id, user_id, event_id, certificate_number, pdf_url)
         VALUES (?, ?, ?, ?, ?)`,
        [booking.id, booking.user_id, event_id, certificate_number, pdf_url]
      );

      generatedCount++;
      // Small delay to ensure unique timestamps
      await new Promise(r => setTimeout(r, 50));
    }

    res.json({
      message: `${generatedCount} certificates generated successfully`,
      count: generatedCount
    });
  } catch (error) {
    console.error('Auto-generate certificates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get certificate statistics
exports.getCertificateStats = async (req, res) => {
  try {
    const organizer_id = req.user.id;

    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_certificates,
        SUM(CASE WHEN downloaded = TRUE THEN 1 ELSE 0 END) as downloaded,
        SUM(CASE WHEN downloaded = FALSE THEN 1 ELSE 0 END) as pending
      FROM certificates c
      JOIN events e ON c.event_id = e.id
      WHERE e.organizer_id = ?`,
      [organizer_id]
    );

    res.json(stats[0]);
  } catch (error) {
    console.error('Get certificate stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
