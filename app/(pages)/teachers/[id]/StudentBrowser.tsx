'use client';

import { ChangeEvent, useEffect, useReducer, useState } from "react";
import StudentList from "./StudentList";
import StudentManager from "./StudentManager";
import { EnrolleeWithCurrentWeekPractice, Group } from "@/app/types";
import { getDetails } from "./actions";
import { reducer } from "@/app/_activeStudentReducer/activeStudentReducer";
import Elipsis from "@/app/ui/components/Elipsis";
import NewGroupButton from "./NewGroupButton";
import EditGroupButton from "./EditGroupButton";
import DeleteGroupButton from "./DeleteGroupButton";
import { useRouter } from "next/navigation";

function StudentBrowser({ students, teacher_id }: { students: EnrolleeWithCurrentWeekPractice[], teacher_id: string }) {
  const [state, dispatch] = useReducer(reducer, undefined);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filterId, setFilterId] = useState('0');
  const [filtered, setFiltered] = useState<EnrolleeWithCurrentWeekPractice[]>(students)
  const router = useRouter();

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

  const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const filterVal = e.target.value;
    const group = groups.find(group => group.id == filterVal);

    setFiltered(prev => {
      console.log(prev.length)
        return [...students.filter(s => {
          if (!group) return true;
          return s.group_id == group.id
        })]
    })

    dispatch({type: 'CLEAR_DETAILS'})
    setFilterId(group?.id || '0')
  
  }

  const handleNewGroup = (g: Group) => {
    if (!groups) {
      setGroups([g])
    } else {
      setGroups(prev => [...prev, g])
    }
  }

  const handleEditGroup = (g: Group) => {
    setGroups(prev => {
      return [...prev.map(each => each.id == g.id ? g : each)]
    })
    students.forEach(each => {
      if (each.group_id == g.id) {
        each.group_color = g.color;
      }
    })
    setFiltered(prev => {
      console.log(prev.length)
        return [...students.filter(s => {
          if (!filterId) return true;
          return s.group_id == filterId
        })]
    })
    router.refresh();
  }

  const handleDeleteGroup = (g: Group) => {
    dispatch({type: 'CLEAR_DETAILS'});
    setFilterId('0');
    students.forEach(each => {
      if (each.group_id == g.id) {
        each.group_color = '#000000';
        each.group_id = null;
      }
    })
    setFiltered(students)
    setGroups(prev => prev.filter(each => each.id !== g.id))
    router.refresh();
  }

  const handleDeselect = (target: HTMLElement)=>{
    if (target.tagName == 'MAIN' || target.id == 'studentList') {
      dispatch({type: "CLEAR_DETAILS"})
    }
  }

  const handleDeleteStudent = (id: string) => {
    const idx = students.findIndex(s => s.id == id);
    students.splice(idx, 1);
    dispatch({ type: "SET_SELECTED_STUDENT", payload: undefined });
    setFiltered(prev => {
      console.log(prev.length)
        return [...students.filter(s => {
          if (!filterId) return true;
          return s.group_id == filterId
        })]
    })
    router.refresh();
  }

  const handleClick = (e: MouseEvent) => {
    handleDeselect(e.target as HTMLElement)
  }
  const handleTouch = (e: TouchEvent) => {
    handleDeselect(e.touches[0].target as HTMLElement)
  }

  useEffect(()=>{
    fetch(`/api/teachers/${teacher_id}/groups`)
      .then(res => res.json())
      .then(json => {
        setGroups(json.data)
      }).catch(err => {
        console.error(err)
      })
  }, [])

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
      <div className="lg:col-span-2 w-full max-w-[500px] mx-auto flex items-center justify-start gap-2 my-2">
        <label htmlFor="filter" className="hidden w-40">Group</label>
        <select name="filter" id="filter" onChange={handleFilter} className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-white p-2 w-full truncate rounded-xl">
          <option value={0}>All Students</option>
          {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        {filterId !== '0' && <EditGroupButton onUpdate={handleEditGroup} group={groups.find(g => g.id === filterId)} teacher_id={teacher_id}/>}
        {filterId !== '0' && <DeleteGroupButton onDelete={handleDeleteGroup} group={groups.find(g => g.id === filterId)} teacher_id={teacher_id} />}
        <NewGroupButton teacher_id={teacher_id} onCreate={handleNewGroup}/>
      </div>
      <StudentList
        students={filtered}
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
        onDelete={handleDeleteStudent}
      />}
    </div>
  );
}

export default StudentBrowser;
