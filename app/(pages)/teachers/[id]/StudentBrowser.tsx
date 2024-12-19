'use client';

import { useEffect, useReducer, useState } from "react";
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
      console.log("New student details fetched");
    };

    if (state?.student) {
      init(state.student);
    } else {
      dispatch({ type: "CLEAR_DETAILS" });
      console.log("No student selected");
    }
  }, [state?.student]);

  return (
    <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2">
      <StudentList
        students={students}
        disabled={state?.isLoading}
        setSelected={(student) => {
          dispatch({ type: "SET_SELECTED_STUDENT", payload: student })}
        }
        selected={state?.student}
      />
      {state?.isLoading
        ? <div className="w-full max-w-[600px] bg-secondary rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none text-txtsecondary grid place-items-center text-2xl">
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
