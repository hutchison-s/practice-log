import React, { ChangeEventHandler } from 'react'

function RadioLabel({label, name, value, onChange, defaultChecked}: {label: string | React.ReactNode, name: string, value: string, onChange: ChangeEventHandler, defaultChecked?: boolean}) {
  return (
    <label className='p-4 grid place-items-center font-xl glass font-golos font-bold text-zinc-400 rounded-xl w-full cursor-pointer radio-label'>
        <span>{label}</span>
        <input hidden type="radio" onChange={onChange} name={name} id={`${label}-${name}`} value={value} defaultChecked={defaultChecked}/>
    </label>
  )
}

export default RadioLabel