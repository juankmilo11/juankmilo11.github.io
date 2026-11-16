import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export class D1Database {
  constructor(filename = ':memory:', { migrate = true } = {}) {
    this.sqlite = new DatabaseSync(filename);
    this.sqlite.exec('PRAGMA foreign_keys=ON;');
    if (migrate) {
      const sql = readFileSync(fileURLToPath(new URL('../drizzle/0000_persistent_appointments.sql', import.meta.url)), 'utf8');
      this.sqlite.exec(sql);
    }
  }
  prepare(sql) {
    const database = this;
    const query = (values=[]) => ({
      bind(...bound) { return query(bound); },
      async first(column) { const row=database.sqlite.prepare(sql).get(...values); return row ? column ? row[column] : {...row} : null; },
      async all() { return {results:database.sqlite.prepare(sql).all(...values).map(row=>({...row}))}; },
      async run() { const result=database.sqlite.prepare(sql).run(...values); return {success:true,meta:{changes:Number(result.changes)}}; },
      execute() { const statement=database.sqlite.prepare(sql); if(/\bRETURNING\b/i.test(sql)||/^\s*SELECT\b/i.test(sql))return {success:true,results:statement.all(...values).map(row=>({...row}))};const result=statement.run(...values);return {success:true,meta:{changes:Number(result.changes)}}; }
    });
    return query();
  }
  async batch(statements) {
    this.sqlite.exec('BEGIN IMMEDIATE');
    try { const result=statements.map(statement=>statement.execute());this.sqlite.exec('COMMIT');return result; }
    catch(error){this.sqlite.exec('ROLLBACK');throw error;}
  }
  close(){this.sqlite.close();}
}
export class R2Bucket {
  objects = new Map();
  failDelete = false;
  async put(key,bytes,options){this.objects.set(key,{bytes:new Uint8Array(bytes),options});return {key};}
  async get(key){const value=this.objects.get(key);return value?{body:value.bytes}:null;}
  async delete(key){if(this.failDelete)throw new Error('Storage unavailable');this.objects.delete(key);}
}
