import PageTitle from '@/app/ui/components/PageTitle'
import { Metadata } from 'next';
import Metronome from './Metronome';

export const metadata: Metadata = {
    title: "Metronome",
    description: "Practice HQ's built-in metronome tool with a variety of meters and subdividing options for amplifying the productivity during practice time.",
  };

function MetronomePage() {

  return (
    <>
        <PageTitle>Metronome</PageTitle>
        <Metronome />
    </>
  )
}

export default MetronomePage