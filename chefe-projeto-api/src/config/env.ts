import "dotenv/config";

export const env = {
  port: Number(process.env.CHEFE_API_PORT || 4444),
  databaseUrl: process.env.CHEFE_DATABASE_URL || process.env.DATABASE_URL || "",
  jwtSecret: process.env.CHEFE_JWT_SECRET || process.env.JWT_SECRET || "chefe-dev-secret"
};
