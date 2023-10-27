const config = {
  port: process.env.LISTEN_PORT,
  databaseUrl: process.env.DATABASE_URL,
  JwtSecret: process.env.JWT_SECRET
};

export default config;

