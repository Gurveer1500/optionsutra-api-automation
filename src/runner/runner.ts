import { testBacktest } from "../flows/backtest"
import { runLoginTest } from "../flows/login"

export async function runTests() {

  try {

    console.log("Running login tests\n")

    const auth = await runLoginTest()

    if (!auth) {
      console.error("Login test failed: No auth data returned")
      return
    }

    console.log("✓ Login successful!")
    console.log("Auth data available:", {
      userId: auth.userId,
      hasSessionCookie: !!auth.cookies
    })

    const backTestData = await testBacktest(auth.cookies, auth.userId)


  } catch (error) {

    console.error("Login test failed:", error)

  }
}