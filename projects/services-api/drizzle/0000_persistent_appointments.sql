CREATE TABLE administrators (id INTEGER PRIMARY KEY CHECK (id = 1), password_hash TEXT NOT NULL, updated_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, password_version TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX sessions_expiry ON sessions(expires_at);
--> statement-breakpoint
CREATE TABLE settings (id TEXT PRIMARY KEY, config TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1);
--> statement-breakpoint
CREATE TABLE appointments (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, whatsapp TEXT NOT NULL, instagram TEXT NOT NULL DEFAULT '',
 service TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, start_minute INTEGER NOT NULL,
 end_minute INTEGER, duration_minutes INTEGER, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','completed','cancelled')),
 notes TEXT NOT NULL DEFAULT '', payload TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 idempotency_hash TEXT NOT NULL UNIQUE, request_hash TEXT NOT NULL,
 CHECK(status <> 'confirmed' OR (duration_minutes > 0 AND end_minute > start_minute))
);
--> statement-breakpoint
CREATE INDEX appointments_date_status ON appointments(date,status,start_minute);
--> statement-breakpoint
CREATE INDEX appointments_created ON appointments(created_at,id);
--> statement-breakpoint
CREATE TABLE request_receipts (key_hash TEXT PRIMARY KEY, request_hash TEXT NOT NULL, appointment_id TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0 CHECK(deleted IN (0,1)));
--> statement-breakpoint
CREATE TABLE attachments (id TEXT PRIMARY KEY, appointment_id TEXT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE, object_key TEXT NOT NULL UNIQUE, name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX attachments_appointment ON attachments(appointment_id);
--> statement-breakpoint
CREATE TABLE object_deletions (object_key TEXT PRIMARY KEY, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TRIGGER attachment_cleanup AFTER DELETE ON attachments BEGIN INSERT OR IGNORE INTO object_deletions(object_key,created_at) VALUES(OLD.object_key,strftime('%Y-%m-%dT%H:%M:%fZ','now')); END;
--> statement-breakpoint
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX rate_limits_expiry ON rate_limits(expires_at);
--> statement-breakpoint
CREATE TABLE audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, appointment_id TEXT NOT NULL, action TEXT NOT NULL, version INTEGER NOT NULL, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TRIGGER appointment_confirm_insert BEFORE INSERT ON appointments WHEN NEW.status = 'confirmed'
BEGIN SELECT RAISE(ABORT, 'appointment_overlap') WHERE EXISTS (SELECT 1 FROM appointments a WHERE a.status='confirmed' AND a.date=NEW.date AND a.start_minute < NEW.end_minute AND a.end_minute > NEW.start_minute); END;
--> statement-breakpoint
CREATE TRIGGER appointment_confirm_update BEFORE UPDATE ON appointments WHEN NEW.status = 'confirmed'
BEGIN SELECT RAISE(ABORT, 'appointment_overlap') WHERE EXISTS (SELECT 1 FROM appointments a WHERE a.id<>NEW.id AND a.status='confirmed' AND a.date=NEW.date AND a.start_minute < NEW.end_minute AND a.end_minute > NEW.start_minute); END;
--> statement-breakpoint
CREATE TRIGGER appointment_created AFTER INSERT ON appointments BEGIN INSERT INTO audit_log(appointment_id,action,version,created_at) VALUES(NEW.id,'created',NEW.version,NEW.created_at); END;
--> statement-breakpoint
CREATE TRIGGER appointment_updated AFTER UPDATE ON appointments BEGIN INSERT INTO audit_log(appointment_id,action,version,created_at) VALUES(NEW.id,'updated',NEW.version,NEW.updated_at); END;
--> statement-breakpoint
CREATE TRIGGER appointment_deleted AFTER DELETE ON appointments BEGIN INSERT INTO audit_log(appointment_id,action,version,created_at) VALUES(OLD.id,'deleted',OLD.version,strftime('%Y-%m-%dT%H:%M:%fZ','now')); UPDATE request_receipts SET deleted=1 WHERE appointment_id=OLD.id; END;
