// prisma.config.js — Prisma 7 configuration
// Prisma 7 requires connection URL to be specified here, not in schema.prisma
require('dotenv').config();

const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
