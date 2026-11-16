ALTER TABLE attachments ADD COLUMN field TEXT CHECK (field IN ('currentPhoto', 'inspirationPhoto'));
