const db = require('./config/db');

async function addPaymentFields() {
  try {
    console.log('Ensuring payments table has payer_name and upi_id columns...');

    // Add payer_name column if not exists (MySQL 8+ supports IF NOT EXISTS)
    await db.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS payer_name VARCHAR(255) NULL`);
    await db.query(`ALTER TABLE payments ADD COLUMN IF NOT EXISTS upi_id VARCHAR(255) NULL`);

    console.log('✓ payer_name and upi_id columns ensured on payments table');
    process.exit(0);
  } catch (err) {
    console.error('Error ensuring payment fields:', err.message || err);
    process.exit(1);
  }
}

addPaymentFields();
