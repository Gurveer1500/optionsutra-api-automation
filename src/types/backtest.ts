export type backTestStep = {
    name: string;
    payload: Record<string, string>;
    assertions: {
        status: number;
        response: Record<string, any>;
    };
};


export type backTestFile = {
    tests: backTestStep[];
}