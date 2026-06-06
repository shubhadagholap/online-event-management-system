-- ==============================================
-- PERMANENT FIXES FOR EVENT MANAGEMENT SYSTEM
-- ==============================================
-- Run this SQL script after every restart to restore all fixes

-- 1. Fix Status Consistency Issues
-- ================================

-- Update AI & ML event booking to cancelled/refunded
UPDATE bookings 
SET status = 'cancelled', payment_status = 'refunded' 
WHERE id IN (
  SELECT b.id FROM bookings b
  JOIN events e ON b.event_id = e.id
  WHERE e.title = 'AI & ML' AND e.status = 'cancelled'
);

-- Fix all cancelled bookings to have consistent payment status
UPDATE bookings 
SET payment_status = CASE 
  WHEN payment_status = 'paid' THEN 'refunded'
  WHEN payment_status IS NULL OR payment_status = '' THEN 'cancelled'
  ELSE 'cancelled'
END
WHERE status = 'cancelled' 
AND payment_status NOT IN ('refunded', 'cancelled');

-- Fix bookings for cancelled events
UPDATE bookings b
JOIN events e ON b.event_id = e.id
SET b.status = 'cancelled', 
    b.payment_status = CASE 
      WHEN b.payment_status = 'paid' THEN 'refunded'
      ELSE 'cancelled'
    END
WHERE e.status = 'cancelled' AND b.status != 'cancelled';

-- 2. Create Refunded Payment Records
-- ==================================

-- Update existing payments to refunded status for AI & ML
UPDATE payments p
JOIN bookings b ON p.booking_id = b.id
JOIN events e ON b.event_id = e.id
SET p.status = 'refunded'
WHERE e.title = 'AI & ML' AND b.status = 'cancelled' AND b.payment_status = 'refunded';

-- Update other cancelled bookings with paid status to refunded
UPDATE payments p
JOIN bookings b ON p.booking_id = b.id
SET p.status = 'refunded'
WHERE b.status = 'cancelled' AND b.payment_status = 'refunded' AND p.status = 'completed';

-- 3. Generate Missing Certificates
-- ================================

-- Create certificates for confirmed bookings that don't have them
INSERT IGNORE INTO certificates (user_id, event_id, booking_id, certificate_number, issued_at, pdf_url, downloaded)
SELECT 
  b.user_id,
  b.event_id,
  b.id,
  CONCAT('CERT-', UNIX_TIMESTAMP(), FLOOR(RAND() * 1000)),
  NOW(),
  CONCAT('/certificates/CERT-', UNIX_TIMESTAMP(), FLOOR(RAND() * 1000), '.pdf'),
  FALSE
FROM bookings b
LEFT JOIN certificates c ON b.id = c.booking_id
WHERE b.status = 'confirmed' AND c.id IS NULL;

-- 4. Verification Queries
-- =======================

-- Check booking status consistency
SELECT 'Booking Status Check' as check_type,
  COUNT(*) as total_bookings,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
  SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid,
  SUM(CASE WHEN payment_status = 'refunded' THEN 1 ELSE 0 END) as refunded
FROM bookings;

-- Check payment status counts
SELECT 'Payment Status Check' as check_type,
  COUNT(*) as total_payments,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) as refunded
FROM payments;

-- Check certificate counts
SELECT 'Certificate Check' as check_type,
  (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
  (SELECT COUNT(*) FROM certificates) as total_certificates;

-- 5. Show Key Status Examples
-- ===========================

SELECT 'Key Event Status Examples' as info,
  u.name as user_name,
  e.title as event_title,
  e.status as event_status,
  b.status as booking_status,
  b.payment_status as payment_status
FROM bookings b
JOIN events e ON b.event_id = e.id
JOIN users u ON b.user_id = u.id
WHERE e.title IN ('AI & ML', 'Tech Summit 2026', 'Rock Festival')
ORDER BY e.title, u.name;