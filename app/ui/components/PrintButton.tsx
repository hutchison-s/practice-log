'use client'
import { Printer } from "lucide-react"
import { PrimaryButton } from "./Buttons"

export default function PrintButton() {
    return <PrimaryButton onClick={()=>window.print()}><Printer /></PrimaryButton>
}