'use client';

import { useEffect, useReducer } from "react";
import StudentList from "./StudentList";
import StudentManager from "./StudentManager";
import { EnrolleeWithCurrentWeekPractice } from "@/app/types";
import { getDetails } from "./actions";
import { reducer } from "@/app/_activeStudentReducer/activeStudentReducer";
import Elipsis from "@/app/ui/components/Elipsis";

function StudentBrowser({ students }: { students: EnrolleeWithCurrentWeekPractice[] }) {
  const [state, dispatch] = useReducer(reducer, undefined);

  useEffect(() => {
    const init = async (student?: EnrolleeWithCurrentWeekPractice) => {
        if (!student) return;
        const data = await getDetails(student.id, student.created_at, student.day_of_week);
        if (!data) {
          dispatch({ type: "CLEAR_DETAILS" });
          return;
        }
        const { logs, goals, resources, time, nextLessonDay } = data;
        dispatch({
          type: "SET_DETAILS",
          payload: {
            logs: logs || [],
            goals: goals || [],
            resources: resources || [],
            time,
            nextLessonDay,
            student,
            isLoading: false
          },
        });
    };
    if (state?.student) {
      init(state.student);
    } else {
      dispatch({ type: "CLEAR_DETAILS" });
    }
  }, [state?.student]);

  const handleDeselect = (target: HTMLElement)=>{
    if (target.tagName == 'MAIN' || target.id == 'studentList') {
      dispatch({type: "CLEAR_DETAILS"})
    }
  }
  const handleClick = (e: MouseEvent) => {
    handleDeselect(e.target as HTMLElement)
  }
  const handleTouch = (e: TouchEvent) => {
    handleDeselect(e.touches[0].target as HTMLElement)
  }
  useEffect(()=>{
    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouch)

    return ()=>{
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  return (
    <div className="w-full max-w-[1000px] justify-items-center grid grid-cols-1 lg:grid-cols-2">
      <StudentList
        students={students}
        disabled={state?.isLoading}
        setSelected={(student) => {
          if (student !== state?.student) {
            dispatch({ type: "SET_SELECTED_STUDENT", payload: student })}
          }
        }
        selected={state?.student}
      />
      {state?.isLoading
        ? <div className="w-full max-w-[600px] glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none text-zinc-400 font-inter font-light grid place-items-center text-2xl">
          <p>Gathering Info<Elipsis /></p>
          </div>
        : <StudentManager
        details={state}
        dispatch={dispatch}
      />}
    </div>
  );
}

export default StudentBrowser;
