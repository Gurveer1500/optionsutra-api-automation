import fs from "fs";
import { env } from "../config/env";
import { httpClient } from "../client/httpClient";
import { sendOTP, verifyOTP } from "../endpoints/endpoints";
import { LoginTestFile } from "../types/loginTest";
import { runAssertions } from "../assertions/assertions";

export type AuthData = {
  cookies: string;
  userId: string;
  headers: Record<string, string>;
};

export async function runLoginTest(): Promise<AuthData | null> {
    const raw = fs.readFileSync("./src/testcases/login.json", "utf-8")
    const testFile : LoginTestFile = JSON.parse(raw)
    
    let authData: AuthData | null = null

    for (const test of testFile.tests) {
        console.log(`RUNNING: ${test.name}`)

        const userKey = test.sendOTP.payload?.["user_key"] === "{{USER_KEY}}" ? env.USER_KEY : test.sendOTP.payload?.["user_key"]   

        const sendOTPResponse = await httpClient({
            method: "POST",
            url: sendOTP,
            body: {
                "user_key" : userKey
            }
        })

        runAssertions(
            sendOTPResponse.status,
            sendOTPResponse.data,
            test.sendOTP.assertions 
        )

        if (sendOTPResponse.status !== 200) {
            console.log("Skipping verifyOTP because sendOTP failed")
            continue
        }

        const requestId = sendOTPResponse.data.data.request_id

         if (!test.verifyOTP) {
            throw new Error(`Test "${test.name}" is missing verifyOtp configuration`)
        }
        const otp = test.verifyOTP.payload?.["otp"] === "{{OTP}}" ? env.OTP : test.verifyOTP?.payload?.["otp"]

        const verifyOTPResponse = await httpClient({
            method:"POST",
            url: verifyOTP,
            body: {
                "request_id": requestId,
                otp
            }
        })

        runAssertions(
            verifyOTPResponse.status,
            verifyOTPResponse.data,
            test.verifyOTP.assertions || {}
        )

        const cookie = verifyOTPResponse.headers.get("set-cookie")
        const userId = verifyOTPResponse.headers.get("x-user-id")

        console.log("Test passed\n")
        
        if (!authData && cookie && userId) {
          authData = {
            cookies: cookie,
            userId: userId,
            headers: {
              "Cookie": cookie,
              "x-user-id": userId
            }
          }
        }
    }
    
    return authData
}