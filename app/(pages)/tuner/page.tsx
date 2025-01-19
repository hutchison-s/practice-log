import PageTitle from '@/app/_ui_components/layout/PageTitle'
import { Metadata } from 'next'
import Tuner from './Tuner'

export const metadata: Metadata = {
  title: "Tuner",
  description: "Practice HQ's built-in chromatic tuner for amplifying the productivity during practice time.",
};

function TunerPage() {
    
  return (
    <>
        <PageTitle>Tuner</PageTitle>
        <Tuner />
        
    </>
  )
}

export default TunerPage