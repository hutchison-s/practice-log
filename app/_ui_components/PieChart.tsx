
function PieChart({percent, size}: {percent: number, size: number}) {
  return (
    <div 
        className={`grid aspect-square rounded-full border-[1px] border-teal-500`}
        style={{backgroundImage: `conic-gradient(#14b8a6 ${percent}%, transparent ${percent}%, transparent)`, width: `${size / 10}rem`}}>
    </div>
  )
}

export default PieChart