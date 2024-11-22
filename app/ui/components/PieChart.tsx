
function PieChart({percent, size}: {percent: number, size: number}) {
  return (
    <div 
        className={`grid aspect-square rounded-full border-[1px] border-lighter`}
        style={{backgroundImage: `conic-gradient(#60a5fa ${percent}%, transparent ${percent}%, transparent)`, width: `${size / 10}rem`}}>
    </div>
  )
}

export default PieChart