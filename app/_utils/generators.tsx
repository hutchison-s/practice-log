function getRandomAlphaNumeric(): string {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return characters[Math.random() * 62 | 0];
}

export function generateRandomString(options: {length: number, hyphenBreak?: number} = {length: 16, hyphenBreak: undefined}) {
    if (options.hyphenBreak && options.hyphenBreak < 1) throw new Error('Hyphen break must be positive integer');
    const charBreak = options.hyphenBreak !== undefined ? Math.floor(options.hyphenBreak) : undefined;

    let result = ''
    for (let i = 0; i < options.length; i++) {
        if (i !== 0 && charBreak !== undefined && (i) % charBreak == 0 && i !== options.length - 1) {
            result += '-'
        }
        result += getRandomAlphaNumeric();
    }
    return result;
}

export function generateHex(length = 20) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
}

export function randomInteger(length = 20) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(Math.floor(Math.random() * 10));
    }
    return result.join('');
}