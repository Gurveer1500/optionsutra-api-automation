import dotenv from "dotenv"

dotenv.config({quiet:true})

export const env = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",

  USER_KEY: process.env.USER_KEY || "",

  OTP: process.env.OTP || "",

  TIMEOUT: Number(process.env.TIMEOUT) || 5000,

  ENVIRONMENT: process.env.NODE_ENV || "dev"
}