module.exports = {
  DB: process.env.DB_NAME,
  HOST: process.env.DB_HOST,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DIALECT: process.env.DB_DIALECT,
  EXPIRES_IN: process.env.JWT_EXPIRY,
  SECRET_KEY: process.env.JWT_SECRET,
};
