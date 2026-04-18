-- Add fields required by App v2 design
ALTER TABLE missions ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS date_label text;
ALTER TABLE missions ADD COLUMN IF NOT EXISTS spots_left integer DEFAULT 0;
ALTER TABLE ngos ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE rewards ADD COLUMN IF NOT EXISTS image_url text;
