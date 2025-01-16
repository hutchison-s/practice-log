// studentReducer.ts
import { EnrolleeWithCurrentWeekPractice, Goal, Resource, StudentDetails } from "@/app/types";

// Define action types
type Action =
  | { type: "CREATE_RESOURCE"; payload: { resource: Resource } }
  | { type: "DELETE_RESOURCE"; payload: { resourceId: string } }
  | { type: "CREATE_GOAL"; payload: { goal: Goal } }
  | { type: "DELETE_GOAL"; payload: { goalId: string } }
  | { type: "UPDATE_GOAL"; payload: { goal: Goal } }
  | { type: "SET_DETAILS"; payload: StudentDetails }
  | { type: "CLEAR_DETAILS" }
  | { type: "SET_SELECTED_STUDENT"; payload: EnrolleeWithCurrentWeekPractice | undefined};
// Reducer function
export const reducer = (state: StudentDetails | undefined, action: Action): StudentDetails | undefined => {
  switch (action.type) {
    case "CREATE_GOAL":
      if (state) {
        return {
          ...state,
          goals: [action.payload.goal, ...state.goals],
        };
      }
      return state;

    case "DELETE_GOAL":
      if (state) {
        return {
          ...state,
          goals: state.goals.filter((res) => res.id !== action.payload.goalId),
        };
      }
      return state;
    case "UPDATE_GOAL":
      if (state) {
        return {
          ...state,
          goals: state.goals.map(g => {
            if (g.id == action.payload.goal.id) {
              return action.payload.goal;
            } else {
              return g;
            }
          })
        }
      }
      return state;
    case "CREATE_RESOURCE":
      if (state) {
        return {
          ...state,
          resources: [action.payload.resource, ...state.resources],
        };
      }
      return state;

    case "DELETE_RESOURCE":
      if (state) {
        return {
          ...state,
          resources: state.resources.filter((res) => res.id !== action.payload.resourceId),
        };
      }
      return state;

    case "SET_DETAILS":
      return action.payload;

    case "CLEAR_DETAILS":
      return undefined;

    case "SET_SELECTED_STUDENT":
        if (action.payload) {
          if (state) {
            return {
                ...state,
                isLoading: true,
                student: action.payload,
              };
          } else {
              return {
                logs: [],
                resources: [],
                goals: [],
                student: action.payload,
                time: 0,
                nextLessonDay: '',
                isLoading: false
              }
          }            
        } else {
            return undefined;
        }
    default:
      return state;
  }
};

// Export action types if needed
export type ActionType = Action;
