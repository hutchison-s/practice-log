import LogDisplay from "./LogDisplay"

function PracticeLogList({logs}: {logs: any[]}) {
    
  return (
    <div className="grid gap-2">
        {logs.length > 0 && logs.map(each => <LogDisplay key={each.log_id} log={each} />)}
    </div>
  )
}

export default PracticeLogList