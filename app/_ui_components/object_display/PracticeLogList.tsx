import { logRow } from "@/app/types"
import LogDisplay from "./LogDisplay"

function PracticeLogList({logs, onDelete}: {logs: logRow[], onDelete?: (log: logRow)=>void}) {

  return (
    <ul className="grid gap-2 w-full max-w-[600px] mx-auto">
        {logs.length > 0 && logs.map(each => <LogDisplay key={each.id} log={each} onDelete={onDelete}/>)}
    </ul>
  )
}

export default PracticeLogList