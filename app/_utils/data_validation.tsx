export function validatePassword(pass: string): boolean {
    const tests = [
        /[A-Z]+/,
        /[a-z]+/,
        /[0-9]+/,
        /[!@#$%^&*()?]+/,
        /.{8,}/
    ]
    return tests.every(test => test.test(pass))
}

export function validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
export function validateName(name: string) : boolean {
    return /^[a-zA-ZÀ-ž']{1,15}[-\s_]*[a-zA-ZÀ-ž']{1,15}/.test(name);
}