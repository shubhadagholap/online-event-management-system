const db = require('./config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('Searching for confirmed bookings without certificates...');

    const [bookings] = await db.query(
      `SELECT b.*, u.name as user_name, u.id as user_id, e.title as event_title, e.date as event_date
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN events e ON b.event_id = e.id
       WHERE b.status = 'confirmed' AND b.id NOT IN (SELECT booking_id FROM certificates)`
    );

    if (bookings.length === 0) {
      console.log('No confirmed bookings without certificates found.');
      process.exit(0);
    }

    const certDir = path.join(__dirname, 'public', 'certificates');
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

    let count = 0;
    for (const booking of bookings) {
      const certificate_number = `CERT-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
      const fileName = `${certificate_number}.pdf`;
      const filePath = path.join(certDir, fileName);

      // generate PDF
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
      doc.fontSize(20).text(booking.event_title, { align: 'center', italic: true });
      doc.moveDown(2);
      try {
        const evDate = booking.event_date ? new Date(booking.event_date).toLocaleDateString() : '';
        doc.fontSize(14).text(`Event Date: ${evDate}`, { align: 'center' });
      } catch (e) {}
      doc.moveDown(4);
      doc.fontSize(12).text(`Certificate Number: ${certificate_number}`, { align: 'right' });
      doc.end();

      // wait for write to finish
      await new Promise((resolve, reject) => writeStream.on('finish', resolve).on('error', reject));

      const pdf_url = `/certificates/${fileName}`;

      await db.query(
        `INSERT INTO certificates (booking_id, user_id, event_id, certificate_number, pdf_url)
         VALUES (?, ?, ?, ?, ?)`,
        [booking.id, booking.user_id, booking.event_id, certificate_number, pdf_url]
      );

      count++;
      console.log(`Created certificate for booking ${booking.id} -> ${fileName}`);
      // small delay to ensure unique timestamps
      await new Promise(r => setTimeout(r, 50));
    }

    console.log(`\nGenerated ${count} certificates.`);
    process.exit(0);
  } catch (err) {
    console.error('Error auto-generating certificates:', err);
    process.exit(1);
  }
}

run();
