export type Pitch = 'high' | 'mid' | 'low'
export const METER_MAP: Record<string, Pitch[]> = {
    'simple,duple': ['high', 'low', 'mid', 'low'],
    'simple,triple': ['high', 'low', 'mid', 'low', 'mid', 'low'],
    'simple,quadruple': ['high', 'low', 'mid', 'low', 'mid', 'low', 'mid', 'low'],
    'compound,duple': ['high', 'low', 'low', 'mid', 'low', 'low'],
    'compound,triple': ['high', 'low', 'low', 'mid', 'low', 'low', 'mid', 'low', 'low'],
    'compound,quadruple': ['high', 'low', 'low', 'mid', 'low', 'low', 'mid', 'low', 'low', 'mid', 'low', 'low'],
    'asymetrical,3-2': ['high', 'low', 'low', 'mid', 'low'],
    'asymetrical,2-3': ['high', 'low', 'mid', 'low', 'low'],
    'asymetrical,4-3': ['high', 'low', 'mid', 'low', 'mid', 'low', 'low'],
    'asymetrical,3-4': ['high', 'low', 'low', 'mid', 'low', 'mid', 'low']
}
export const GAIN_MAP: Record<Pitch, number> = {
    high: 1,
    mid: 0.75,
    low: 0.45
}