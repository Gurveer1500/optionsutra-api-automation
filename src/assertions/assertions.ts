export type Assertions = {
    status?: number;
    body?: Record<string, any>;
}

function getValue(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}

export function runAssertions(
    responseStatus: number,
    responseBody: any,
    assertions: Assertions
) {
    if(assertions.status !== undefined) {
        if(responseStatus !== assertions.status) {
            throw new Error(
                `Status assertion failed. Expected ${assertions.status} but got ${responseStatus}`
            )
        }
    }

    if(assertions.body) {
        for(const key in assertions.body) {

            const expected = assertions.body[key]
            const actual = getValue(responseBody, key)

            if (actual !== expected) {
                throw new Error(
                    `Body assertion failed for "${key}". Expected ${expected} but got ${actual}`
                )
            }
        }
    }
}