# Event Images Directory

## Overview
This directory contains images for events displayed in the Event Management System.

## Image Specifications

### Recommended Dimensions
- **Event Cards:** 800x400px (2:1 aspect ratio)
- **Event Details:** 1200x600px (2:1 aspect ratio)
- **Minimum:** 600x300px
- **Maximum:** 2000x1000px

### File Formats
- JPG/JPEG (recommended for photos)
- PNG (for images with transparency)
- WebP (for modern browsers, best compression)

### File Size
- Target: < 300KB per image
- Maximum: < 500KB per image
- Use image compression tools to optimize

### Naming Convention
Use descriptive, lowercase names with hyphens:
- ✅ `rock-festival-2026.jpg`
- ✅ `tech-summit-san-francisco.jpg`
- ✅ `marathon-city-2026.jpg`
- ❌ `IMG_1234.jpg`
- ❌ `event image.jpg`

## Sample Images

### Default Fallback
- `default-event.jpg` - Used when event has no image or image fails to load

### Example Event Images
- `rock-festival.jpg` - Music festival
- `tech-summit-2026.jpg` - Technology conference
- `marathon-2026.jpg` - Sports event
- `business-conference.jpg` - Business event
- `art-exhibition.jpg` - Arts event
- `food-festival.jpg` - Food event
- `education-workshop.jpg` - Education event

## How to Add Images

### Method 1: Local Files
1. Place image files in this directory: `/frontend/public/images/events/`
2. Reference in database: `/images/events/your-image.jpg`
3. Example:
   ```sql
   UPDATE events SET image_url = '/images/events/rock-festival.jpg' WHERE id = 1;
   ```

### Method 2: External URLs
1. Use full URL in database
2. Example:
   ```sql
   UPDATE events SET image_url = 'https://example.com/images/event.jpg' WHERE id = 1;
   ```

### Method 3: Placeholder Services (Development)
Use placeholder services for testing:
- `https://via.placeholder.com/800x400/667eea/ffffff?text=Event+Name`
- `https://placehold.co/800x400/667eea/white?text=Event+Name`
- `https://dummyimage.com/800x400/667eea/fff&text=Event+Name`

## Image Optimization Tips

### Before Uploading
1. **Resize:** Use 800x400px for optimal display
2. **Compress:** Use tools like TinyPNG, ImageOptim, or Squoosh
3. **Format:** Convert to WebP for best compression (with JPG fallback)
4. **Quality:** 80-85% quality is usually sufficient

### Tools
- **Online:** TinyPNG, Squoosh.app, Compressor.io
- **Desktop:** ImageOptim (Mac), FileOptimizer (Windows)
- **CLI:** ImageMagick, Sharp

### Example ImageMagick Command
```bash
# Resize and compress
magick input.jpg -resize 800x400^ -gravity center -extent 800x400 -quality 85 output.jpg
```

## Fallback System

The application uses a multi-level fallback system:

1. **Primary:** Event's `image_url` from database
2. **Secondary:** `/images/events/default-event.jpg`
3. **Tertiary:** Inline SVG placeholder (if default image missing)

## Database Integration

### Events Table
The `events` table has an `image_url` column:
```sql
image_url VARCHAR(255)
```

### Updating Images
```sql
-- Local image
UPDATE events SET image_url = '/images/events/rock-festival.jpg' WHERE id = 1;

-- External URL
UPDATE events SET image_url = 'https://example.com/event.jpg' WHERE id = 2;

-- Bulk update
UPDATE events SET image_url = CONCAT('/images/events/', LOWER(REPLACE(title, ' ', '-')), '.jpg');
```

## Creating Sample Images

### Quick Method: Use Placeholder Services
Already configured in `backend/addCompleteDummyData.js`

### Professional Method: Download Free Stock Photos

**Free Stock Photo Sites:**
- Unsplash.com
- Pexels.com
- Pixabay.com
- Freepik.com (some free)

**Search Terms:**
- "concert crowd"
- "technology conference"
- "marathon runners"
- "business meeting"
- "art gallery"
- "food festival"

### DIY Method: Create Simple Graphics

**Tools:**
- Canva.com (free templates)
- Figma (free design tool)
- GIMP (free Photoshop alternative)

**Template:**
1. Create 800x400px canvas
2. Add gradient background
3. Add event category icon
4. Add text overlay
5. Export as JPG

## Troubleshooting

### Images Not Showing

**Check 1: File Path**
```javascript
// Correct paths
/images/events/event.jpg          // ✅ Relative to public folder
https://example.com/event.jpg     // ✅ Full URL

// Incorrect paths
images/events/event.jpg           // ❌ Missing leading slash
./images/events/event.jpg         // ❌ Don't use ./
../images/events/event.jpg        // ❌ Don't use ../
```

**Check 2: File Exists**
- Verify file is in `/frontend/public/images/events/`
- Check filename matches exactly (case-sensitive)
- Check file extension (.jpg vs .jpeg)

**Check 3: Browser Console**
- Open DevTools (F12)
- Check Console for errors
- Check Network tab for failed requests

**Check 4: Permissions**
- Ensure files are readable
- Check file permissions (644 or 755)

### Broken Image Icon

If you see a broken image icon:
1. Image file doesn't exist at specified path
2. Image URL is incorrect
3. Image file is corrupted
4. Network error (for external URLs)

The fallback system should prevent this, but check:
- `/images/events/default-event.jpg` exists
- Browser console for errors

## Performance Tips

### Lazy Loading
Images are loaded as needed (React handles this)

### CDN (Production)
For production, consider using a CDN:
- Cloudinary
- Imgix
- AWS CloudFront
- Cloudflare Images

### Responsive Images
The CSS automatically handles responsive sizing:
- Desktop: 250px height (cards), 400px (details)
- Tablet: 200px height (cards), 300px (details)
- Mobile: 180px height (cards), 250px (details)

## Security Notes

### Allowed Formats
- JPG, JPEG, PNG, WebP only
- No executable files
- No SVG with scripts

### File Size Limits
- Recommended: < 300KB
- Maximum: < 500KB
- Prevents slow loading

### External URLs
- Use HTTPS only
- Verify source is trusted
- Consider CORS issues

## Example Implementation

### Adding Image to New Event
```javascript
// Frontend - AdminEvents.js
const eventData = {
  title: 'Rock Festival 2026',
  description: '...',
  image_url: '/images/events/rock-festival.jpg',
  // ... other fields
};
```

### Displaying Image
```javascript
// Frontend - EventCard.js
<img 
  src={event.image_url || '/images/events/default-event.jpg'}
  alt={event.title}
  onError={(e) => e.target.src = '/images/events/default-event.jpg'}
/>
```

## Quick Start

1. **Add default image:**
   - Create or download a default event image
   - Save as `/frontend/public/images/events/default-event.jpg`

2. **Add event images:**
   - Download or create images for your events
   - Save in `/frontend/public/images/events/`
   - Use descriptive names

3. **Update database:**
   ```sql
   UPDATE events SET image_url = '/images/events/your-image.jpg' WHERE id = 1;
   ```

4. **Test:**
   - Refresh browser
   - Check images load correctly
   - Test fallback by using wrong path

## Support

For issues or questions:
1. Check browser console (F12)
2. Verify file paths
3. Check database image_url values
4. Review this README

---

**Last Updated:** February 16, 2026
**Version:** 1.0
