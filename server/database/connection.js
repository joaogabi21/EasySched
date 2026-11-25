const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const DB_PATH = path.join(__dirname, 'easysched.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let dbInstance = null;

async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  await dbInstance.exec(schemaSql);

  return dbInstance;
}

module.exports = { getDatabase };