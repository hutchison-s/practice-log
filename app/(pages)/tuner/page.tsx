'use client'

import PageTitle from '@/app/ui/components/PageTitle'
import React, {useState, useEffect, useRef} from 'react'
import { frequencyToPitch, NoteRecord, yin } from './FrequncyMaps'
import { PrimaryButton } from '@/app/ui/components/Buttons'
import PitchName from './PitchName'

function TunerPage() {
    const [isListening, setIsListening] = useState(false)
    const listeningRef = useRef(false)
    const [frequency, setFrequency] = useState<number | null>(null)
    const [notes, setNotes] = useState<{target: NoteRecord, above: NoteRecord, below: NoteRecord, cents: number} | undefined>()
    const [leftOffset, setLeftOffset] = useState(0)
    const parent = useRef<HTMLDivElement>(null)
    const marker = useRef<HTMLDivElement>(null)
    const frequencyHistory = useRef<number[]>([])

    useEffect(() => {
        if (!isListening) return;
        const getAudioInput = async () => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new window.AudioContext
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          const bufferLength = analyser.fftSize;
          const buffer = new Float32Array(bufferLength);
    
          analyser.fftSize = 2048;
          source.connect(analyser);
    
          const detect = () => {
            analyser.getFloatTimeDomainData(buffer);
            const pitch = yin(buffer, audioContext.sampleRate);
            if (pitch && pitch > 40 && pitch < 8000) {

                // Get average of last 16 frequencies
                frequencyHistory.current.push(pitch);
                if (frequencyHistory.current.length > 16) {
                    frequencyHistory.current.shift();
                }
                const averageFrequency = frequencyHistory.current.reduce((acc, curr) => acc + curr, 0) / frequencyHistory.current.length;
                
                if (frequency !== averageFrequency) {
                    setFrequency(averageFrequency);
                }
            }
            if (listeningRef.current) {
                requestAnimationFrame(detect);
            }
          };
    
          detect();
        };
    
        getAudioInput();
      }, [isListening]);

      useEffect(()=>{
        if (frequency) {
            setLeftOffset(calculateLeftOffset())
            setNotes(prev => {
                return {
                    ...prev,
                    ...frequencyToPitch(frequency)
                }
            })
        }
      }, [frequency])

      function start() {
        setIsListening(true);
        listeningRef.current = true;
      }
      function stop() {
        setIsListening(false)
        listeningRef.current = false;
      }
      

      function calculateLeftOffset() {
        if (!parent.current || !marker.current || !notes) return 0;
        const parentWidth = parent.current.offsetWidth;
        const half = parentWidth / 2;
        const markerOffset = marker.current.clientWidth / 2;
        const offset = parentWidth * (Math.abs(notes.cents) / 100)
        return notes.cents > 0 ? half + offset - markerOffset : half - offset - markerOffset;
      }
    
  return (
    <>
        <PageTitle>Tuner</PageTitle>
        
        {isListening && notes && <p>{notes.cents} cents {notes.cents > 0 ? 'sharp' : 'flat'}</p>}
        {isListening && notes && <div className='flex w-full glass rounded' ref={parent}>
            {notes && isListening &&
                <>
                    <div className="flex-1 h-full min-h-48 p-2 rounded bg-background/75 grid place-items-center font-fold text-2xl py-12 md:text-2xl "><PitchName note={notes.below.note} /></div>
                    <div className="flex-1 h-full min-h-48 p-2 rounded bg-transparent grid place-items-center font-fold text-3xl py-12 md:text-5xl " style={{backgroundImage: Math.abs(notes.cents) <= 9 ? 'linear-gradient(-45deg, #115e59, #0891b2)' : 'initial'}}><PitchName note={notes.target.note} /></div>
                    <div className="flex-1 h-full min-h-48 p-2 rounded bg-background/75 grid place-items-center font-fold text-2xl py-12 md:text-2xl "><PitchName note={notes.above.note} /></div>
                    {frequency && <div ref={marker} style={{transform: `translateX(${leftOffset}px) translateY(-50%)`}} className='text-2xl p-2 absolute transition-transform top-1/2 left-0 text-red-400 font-bold w-10 bg-lighter rounded-sm h-full'></div>}

                </>}
        </div>}
        <div className='pt-8 w-full grid place-items-center'>
        {isListening
            ? <PrimaryButton onClick={stop} size='lg'>Stop Tuning</PrimaryButton>
            : <PrimaryButton onClick={start} size='lg'>Start Tuning</PrimaryButton>
        }
        </div>
        
    </>
  )
}

export default TunerPage