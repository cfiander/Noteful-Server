module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // DB_URL: process.env.DATABASE_URL || 'postgres://christopherfiander@localhost/Noteful'
  DB_URL: process.env.DATABASE_URL || 'postgresql://christopherfiander@localhost/Noteful',
}