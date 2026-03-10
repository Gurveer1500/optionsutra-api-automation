import { readFileSync } from "fs"
import { backTestFile, backTestStep } from "../types/backtest"
import { httpClient } from "../client/httpClient"
import { compute } from "../endpoints/endpoints"
import { runAssertions } from "../assertions/assertions"

export async function testBacktest(cookie: string, userId: string) {
    const raw = readFileSync("./src/testcases/backtest.json", "utf-8")
    const testFile: backTestFile = JSON.parse(raw)


    for (const test of testFile.tests) {
        console.log(`RUNNING: ${test.name}`)
        const payload = test.payload
        const backTestResponse = await httpClient({
            method: "POST",
            url: compute,
            body: payload,
            headers: {
                "x-user-id": userId,
                "cookie": cookie
            }
        })
       
        // console.log("Response data:", backTestResponse.data)
        // console.log("TEST ASSERTIONS:", test.assertions)
        runAssertions(
            backTestResponse.status,
            backTestResponse.data,
            test.assertions
        )
        console.log("Test passed\n")
    }
}