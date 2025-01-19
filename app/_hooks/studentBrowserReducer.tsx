import { Enrollee, Goal, Group, logRow, Resource } from "../types";

type Action = 
    | {type: 'ADD_STUDENT', payload: Enrollee}
    | {type: 'DELETE_STUDENT', payload: Enrollee}
    | {type: 'MODIFY_STUDENT', payload: Enrollee}
    | {type: 'UPDATE_ALL', payload: Enrollee[]}
    | {type: 'SET_ACTIVE', payload: AssociatedStudentRecords | null}
    | {type: 'ADD_GOAL', payload: Goal}
    | {type: 'DELETE_GOAL', payload: Goal}
    | {type: 'UPDATE_GOAL', payload: Goal}
    | {type: 'ADD_RESOURCE', payload: Resource}
    | {type: 'DELETE_RESOURCE', payload: Resource}
    | {type: 'UPDATE_RESOURCE', payload: Resource}
    | {type: 'ADD_GROUP', payload: Group}
    | {type: 'DELETE_GROUP', payload: Group}
    | {type: 'UPDATE_GROUP', payload: Group}

export type StudentBrowserStateType = {
    studentList: Enrollee[],
    groups: Group[],
    activeStudentDetails: AssociatedStudentRecords | null
}

export type AssociatedStudentRecords = {
    logs: logRow[], 
    goals: Goal[], 
    resources: Resource[]
}

export const studentBrowserReducer = (state: StudentBrowserStateType, action: Action): StudentBrowserStateType => {
    switch (action.type) {
        case 'ADD_STUDENT':
            return {
                ...state,
                studentList: [
                ...state.studentList,
                action.payload as Enrollee
            ]}
        case 'DELETE_STUDENT':
            return {
                ...state,
                studentList: [
                    ...state.studentList.filter(s => s.id !== action.payload.id)
                ],
                activeStudentDetails: null
            };
        case 'MODIFY_STUDENT':
            console.log('updating to', action.payload)
            return {
                ...state,
                studentList: [
                    ...state.studentList.map(s => s.id == action.payload.id ? {...s, ...action.payload} : {...s})
                ]
            };
        case 'UPDATE_ALL':
            return {
                ...state,
                studentList: [
                    ...action.payload
                ]
            }
        case 'SET_ACTIVE':
            return {
                ...state,
                activeStudentDetails: action.payload 
                    ?   {
                            ...action.payload
                        } 
                    : null
            }
        case 'ADD_GOAL':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                activeStudentDetails: {
                    ...state.activeStudentDetails,
                    goals: [
                        action.payload,
                        ...state.activeStudentDetails.goals
                    ]
                }
            }
        case 'DELETE_GOAL':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                activeStudentDetails: {
                    ...state.activeStudentDetails,
                    goals: [
                        ...state.activeStudentDetails.goals.filter(g => g.id !== action.payload.id)
                    ]
                }
            }
        case 'UPDATE_GOAL':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                activeStudentDetails: {
                    ...state.activeStudentDetails,
                    goals: [
                        ...state.activeStudentDetails.goals.map(g => g.id == action.payload.id ? action.payload : g)
                    ]
                }
            }
        case 'ADD_RESOURCE':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                activeStudentDetails: {
                    ...state.activeStudentDetails,
                    resources: [
                        action.payload,
                        ...state.activeStudentDetails.resources
                    ]
                }
            }
        case 'DELETE_RESOURCE':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                activeStudentDetails: {
                    ...state.activeStudentDetails,
                    resources: [
                        ...state.activeStudentDetails.resources.filter(r => r.id !== action.payload.id)
                    ]
                }
            }
        case 'UPDATE_RESOURCE':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                activeStudentDetails: {
                    ...state.activeStudentDetails,
                    resources: [
                        ...state.activeStudentDetails.resources.map(r => r.id == action.payload.id ? action.payload : r)
                    ]
                }
            }
        case 'ADD_GROUP':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                groups: [
                    action.payload,
                    ...state.groups
                ]
            }
        case 'DELETE_GROUP':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                studentList: [
                    ...state.studentList.map(s => s.group_id == action.payload.id ? {...s, group_id: null, group_color: '#000000'} : {...s})
                ],
                groups: [
                    ...state.groups.filter(g => g.id !== action.payload.id)
                ]
            }
        case 'UPDATE_GROUP':
            if (!state.activeStudentDetails) return state;
            return {
                ...state,
                studentList: [
                    ...state.studentList.map(s => s.group_id == action.payload.id ? {...s, group_color: action.payload.color} : {...s})
                ],
                groups: [
                    ...state.groups.map(g => g.id == action.payload.id ? action.payload : g)
                ]
            }
        default:
            return state;
    }
}