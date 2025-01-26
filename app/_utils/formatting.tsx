export function titleCase(s: string) {
    return s.split(/\s/gi).map(each => upperFirst(each)).join(' ');

}
export function upperFirst(s: string) {
    return s[0].toUpperCase()+s.substring(1);
}