import { EnrolleeWithCurrentWeekPractice } from "../types";

type Action = 
    | {type: 'ADD_STUDENT', payload: EnrolleeWithCurrentWeekPractice}
    | {type: 'DELETE_STUDENT', payload: string}
    | {type: 'MODIFY_STUDENT', payload: EnrolleeWithCurrentWeekPractice}
    | {type: 'UPDATE_ALL', payload: EnrolleeWithCurrentWeekPractice[]}

export const studentListReducer = (state: EnrolleeWithCurrentWeekPractice[], action: Action): EnrolleeWithCurrentWeekPractice[] => {
    switch (action.type) {
        case 'ADD_STUDENT':
            return [
                ...state,
                action.payload as EnrolleeWithCurrentWeekPractice
            ]
        case 'DELETE_STUDENT':
            return [...state?.filter(s => s.id !== action.payload)];
        case 'MODIFY_STUDENT':
            return [...state?.map(s => s.id == action.payload.id ? action.payload : s)];
        case 'UPDATE_ALL':
            return [...action.payload]
        default:
            return state;
    }
}