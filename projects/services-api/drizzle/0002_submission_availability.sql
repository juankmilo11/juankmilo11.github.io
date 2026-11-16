ALTER TABLE appointments ADD COLUMN availability_version INTEGER NOT NULL DEFAULT -1;
--> statement-breakpoint
CREATE TRIGGER appointment_availability BEFORE INSERT ON appointments WHEN NEW.availability_version >= 0
BEGIN
 SELECT RAISE(ABORT,'slot_unavailable') WHERE COALESCE((SELECT version FROM settings WHERE id='schedule'),0) <> NEW.availability_version;
 SELECT RAISE(ABORT,'slot_unavailable') WHERE EXISTS (SELECT 1 FROM appointments a WHERE a.status='confirmed' AND a.date=NEW.date AND a.start_minute < COALESCE(NEW.end_minute,NEW.start_minute+30) AND a.end_minute > NEW.start_minute);
END;
