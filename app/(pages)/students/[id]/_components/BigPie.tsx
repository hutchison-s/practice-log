import PieChart from '@/app/_ui_components/PieChart'
import React from 'react'

function BigPie({percent}: {percent: number}) {
  return (
    <div className="mx-auto relative">
        <div 
            className={`grid aspect-square rounded-full border-[1px] border-white/25 w-[10rem] bg-background select-none`}
            style={{backgroundImage: `conic-gradient(#3730a3 ${percent}%, transparent ${percent}%, transparent)`, boxShadow: '-5px -5px 15px #000000aa inset, -5px -15px 35px #00000055 inset, 2px 4px 18px #ffffff33 inset, 2px 6px 10px #00000055, 0 0 30px #00000022'}}>
        </div>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[3rem] font-golos font-black mix-blend-difference select-none">{percent}%</span>
    </div>
  )
}

export default BigPie