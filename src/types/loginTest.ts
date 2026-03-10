export type LoginStep = {
    payload: Record<string, any>;
    assertions: {
        status: number;
        body: Record<string, any>;
    };
}

export type LoginTestCase = {
    name: string;
    sendOTP: LoginStep;
    verifyOTP: LoginStep;
}

export type LoginTestFile = {
    tests: LoginTestCase[]
}
