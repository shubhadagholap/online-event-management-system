-- Add images to existing events
-- This script updates events that don't have images

-- Update events based on their titles or categories
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop' 
WHERE (title LIKE '%music%' OR title LIKE '%concert%' OR title LIKE '%festival%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop' 
WHERE (title LIKE '%tech%' OR title LIKE '%conference%' OR title LIKE '%summit%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=400&fit=crop' 
WHERE (title LIKE '%sport%' OR title LIKE '%marathon%' OR title LIKE '%game%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop' 
WHERE (title LIKE '%food%' OR title LIKE '%wine%' OR title LIKE '%cooking%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop' 
WHERE (title LIKE '%art%' OR title LIKE '%exhibition%' OR title LIKE '%gallery%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop' 
WHERE (title LIKE '%business%' OR title LIKE '%leadership%' OR title LIKE '%entrepreneur%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=400&fit=crop' 
WHERE (title LIKE '%comedy%' OR title LIKE '%entertainment%' OR title LIKE '%show%') AND (image_url IS NULL OR image_url = '');

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop' 
WHERE (title LIKE '%education%' OR title LIKE '%workshop%' OR title LIKE '%training%') AND (image_url IS NULL OR image_url = '');

-- Default image for any remaining events without images
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop' 
WHERE image_url IS NULL OR image_url = '';

-- Verify the update
SELECT id, title, image_url FROM events LIMIT 10;
