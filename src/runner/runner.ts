import { runLoginTest } from "../flows/login"

export async function runTests() {

  try {

    console.log("Running login tests\n")

    const auth = await runLoginTest()

  } catch (error) {

    console.error("Login test failed:", error)

  }
}