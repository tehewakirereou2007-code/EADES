declare module 'fast-levenshtein' {
    const levenshtein: {
        get: (str1: string, str2: string) => number;
    };
    export default levenshtein;
}
