'use client'

import { useReducer } from "react";
import { AssociatedStudentRecords, studentBrowserReducer, StudentBrowserStateType } from "./studentBrowserReducer";
import { Enrollee, Goal, Group, Resource, StateController } from "../types";

export default function useStudentBrowser(initialState: StudentBrowserStateType) {
    const [state, dispatch] = useReducer(studentBrowserReducer, initialState);

    const studentListController: StateController<Enrollee> = {
        add: (s: Enrollee) => dispatch({type: 'ADD_STUDENT', payload: s}),
        update: (s: Enrollee) => dispatch({type: 'MODIFY_STUDENT', payload: s}),
        delete: (s: Enrollee) => dispatch({type: 'DELETE_STUDENT', payload: s})
    }
    const groupController: StateController<Group> = {
        add: (g: Group) => dispatch({type: 'ADD_GROUP', payload: g}),
        update: (g: Group) => dispatch({type: 'UPDATE_GROUP', payload: g}),
        delete: (g: Group) => dispatch({type: 'DELETE_GROUP', payload: g})
    }
    const studentDetailsController = {
        set: (records: AssociatedStudentRecords) => dispatch({type: 'SET_ACTIVE', payload: records}),
        clear: ()=>dispatch({type: 'SET_ACTIVE', payload: null})
    }
    const goalController: StateController<Goal> = {
        add: (g: Goal) => dispatch({type: 'ADD_GOAL', payload: g}),
        update: (g: Goal) => dispatch({type: 'UPDATE_GOAL', payload: g}),
        delete: (g: Goal) => dispatch({type: 'DELETE_GOAL', payload: g})
    }
    const resourceController: StateController<Resource> = {
        add: (r: Resource) => dispatch({type: 'ADD_RESOURCE', payload: r}),
        update: (r: Resource) => dispatch({type: 'UPDATE_RESOURCE', payload: r}),
        delete: (r: Resource) => dispatch({type: 'DELETE_RESOURCE', payload: r})
    }

    return {
        state,
        dispatch,
        studentListController,
        groupController,
        studentDetailsController,
        goalController,
        resourceController
    }
}