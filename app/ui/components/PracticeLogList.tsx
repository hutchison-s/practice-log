import { logRow } from "@/app/types"
import LogDisplay from "./LogDisplay"

function PracticeLogList({logs}: {logs: logRow[]}) {
    
  return (
    <ul className="grid gap-2 w-full max-w-[600px] mx-auto">
        {logs.length > 0 && logs.map(each => <LogDisplay key={each.log_id} log={each} />)}
    </ul>
  )
}

export default PracticeLogList