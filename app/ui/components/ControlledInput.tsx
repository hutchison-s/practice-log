'use client'
import { ChangeEvent, HTMLInputTypeAttribute, useEffect, useState } from "react"

type InputControls = {
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>)=>void,
    validator: (v: string)=>boolean,
    input_type: HTMLInputTypeAttribute,
    label: string
}

export function ControlledInput({value, onChange, validator, input_type, label}: InputControls) {
    const [isValid, setIsValid] = useState(true)

    useEffect(()=>{
        setIsValid(validator(value))
    }, [value, validator])
    
    return (<label className="relative my-8 block w-full rounded group">
        <span 
            className="absolute -top-3 left-[2px] bg-background px-2 rounded-t group-focus-within:-top-5 group-focus-within:bg-secondary transition-all"
        >
            {label}: 
        </span>
        <input
            onChange={(e)=>{
                setIsValid(validator(e.currentTarget.value));
                onChange(e)
            }} 
            type={input_type}
            name={label.toLowerCase()} 
            className='w-full p-2 border-2 rounded bg-transparent focus:outline-none focus:bg-secondary'
            style={{borderColor: isValid ? 'rgb(var(--secondary))' : 'orangered'}}/>
    </label>)
}