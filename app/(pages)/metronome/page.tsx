'use client'
import PageTitle from '@/app/ui/components/PageTitle'
import RadioLabel from '@/app/ui/components/RadioLabel';
import { Music2, Music3, PlayCircle, StopCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import MetronomeControl from './MetronomeControl';

type Pitch = 'high' | 'mid' | 'low'
const METER_MAP: Record<string, Pitch[]> = {
    'simple,duple': ['high', 'low', 'mid', 'low'],
    'simple,triple': ['high', 'low', 'mid', 'low', 'mid', 'low'],
    'simple,quadruple': ['high', 'low', 'mid', 'low', 'mid', 'low', 'mid', 'low'],
    'compound,duple': ['high', 'low', 'low', 'mid', 'low', 'low'],
    'compound,triple': ['high', 'low', 'low', 'mid', 'low', 'low', 'mid', 'low', 'low'],
    'compound,quadruple': ['high', 'low', 'low', 'mid', 'low', 'low', 'mid', 'low', 'low', 'mid', 'low', 'low'],
    'asymetrical,3-2': ['high', 'low', 'low', 'mid', 'low'],
    'asymetrical,2-3': ['high', 'low', 'mid', 'low', 'low'],
    'asymetrical,4-3': ['high', 'low', 'mid', 'low', 'mid', 'low', 'low'],
    'asymetrical,3-4': ['high', 'low', 'low', 'mid', 'low', 'mid', 'low']
}
const GAIN_MAP: Record<Pitch, number> = {
    high: 1,
    mid: 0.75,
    low: 0.45
}

function Page() {
    const [tempo, setTempo] = useState(120);
    const [subType, setSubType] = useState(1);
    const [meter, setMeter] = useState<Pitch[]>(['high', 'low', 'mid', 'low', 'mid', 'low', 'mid', 'low'])
    const [isPlaying, setIsPlaying] = useState(false);
    const playRef = useRef(false)
    const [audioContext, setAudioContext] = useState<AudioContext>()
    const tones = useRef<Record<Pitch, AudioBuffer | null>>({
        high: null,
        mid: null,
        low: null
    });

    useEffect(() => {
        const fetchTone = async (url: string, context: AudioContext) => {
            const res = await fetch(url);
            const buf = await res.arrayBuffer();
            const data = await context.decodeAudioData(buf);
            return data;
        }
        const initializeAudio = async () => {
            const context = new AudioContext();
            setAudioContext(context)
            tones.current.high = await fetchTone('/audio/high.mp3', context);
            tones.current.mid = await fetchTone('/audio/mid.mp3', context);
            tones.current.low = await fetchTone('/audio/low.mp3', context);
        }
        initializeAudio()
        
    }, []);

    useEffect(()=>{
        let delay;
        if (isPlaying) {
            stop();
            if (delay) {
                clearTimeout(delay)
            }
            delay = setTimeout(play, 300)
        }
    }, [tempo, subType, meter])

    useEffect(()=>{
        if (meter.length == 5 || meter.length == 7) {
            document.getElementById('eighths')?.click()
        }
    }, [meter])

    function handleMeterChange() {
        const target: HTMLInputElement | null = document.querySelector('input[type="radio"][name="meter"]:checked');
        if (!target) return;
        
        setMeter(METER_MAP[target.value]);
    }

    function handleSubdivisionChange() {
        const target = document.querySelector('input[type="radio"][name="subdivision"]:checked') as HTMLInputElement;
        setSubType(parseInt(target.value))
    }

    function handleTogglePlay() {
        if (isPlaying) {
            stop()
        } else {
            play()
        }
    }

    function playTone(tone: Pitch) {
        const sound = audioContext!.createBufferSource()
        sound.buffer = tones.current[tone];
        const gain = audioContext!.createGain();
        gain.gain.value = GAIN_MAP[tone]
        sound.connect(gain);
        gain.connect(audioContext!.destination)
        sound.start()
        
    }
    

    function play() {
        const beat = 60000 / tempo;
        const isCompound = (document.querySelector('input[type="radio"][name="meter"]:checked') as HTMLInputElement)
            .value.split(',')[0] === 'compound';
        const subdivisionLength = isCompound ? beat / 3 : beat / 2;
        let index = 0;
        let nextTick = audioContext!.currentTime
        
        function playNextTone() {
            console.log(performance.now())
            if (subType == 1 && (meter[index] === 'high' || meter[index] === 'mid')) {
                playTone(meter[index]);
            } else if (subType !== 1) {
                playTone(meter[index]);
            }
            index = (index + 1) % meter.length;
        }

        function loop() {
            if (!playRef.current) {
                console.log('not playing');
                return;
            };
            const now = audioContext!.currentTime;

            if (now >= nextTick) {
                playNextTone()
                nextTick += (subdivisionLength / 1000);
                if (now > nextTick) {
                    nextTick = now + (subdivisionLength / 1000);
                }
            }
            requestAnimationFrame(loop)
        }
        playRef.current = true;
        setIsPlaying(true)
        setTimeout(loop, subdivisionLength)
    
    }
    
    function stop() {
        playRef.current = false;
        setIsPlaying(false)
    }


  return (
    <>
        <PageTitle>Metronome</PageTitle>
        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2">
            
            <section className='flex-1 bg-secondary p-4 grid grid-cols-[60px_1fr_60px] rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none'>
            <div className="flex flex-col justify-evenly gap-2 border-2 border-background rounded">
                        <label className='size-full grid place-items-center p-4 radio-label cursor-pointer rounded'>
                            <Music3 />
                            <input onChange={handleSubdivisionChange} hidden type="radio" name="subdivision" value="1" id="beat" defaultChecked disabled={meter.length == 5 || meter.length == 7}/>
                        </label>
                        <label className='size-full grid place-items-center p-4 radio-label cursor-pointer rounded'>
                            <Music2 />
                            <input onChange={handleSubdivisionChange} hidden type="radio" name="subdivision" value="2" id="eighths" />
                        </label>
                    </div>
                <div className='grid size-full place-items-center'>
                    <h3 className='w-full text-3xl font-bold text-center'>Tempo: {tempo}bpm</h3>
                    
                    
                    <button className='rounded-full text-lighter' onClick={handleTogglePlay}>
                        {isPlaying
                            ? <StopCircle size={120} className='drop-shadow' />
                            : <PlayCircle size={120} className='drop-shadow'/>}
                    </button>
                </div>
                <MetronomeControl setTempo={setTempo} />
                
            </section>
            <section className='flex-1 border-2 border-secondary grid gap-2 p-2 pt-6 rounded-b-xl md:rounded-r-xl md:rounded-bl-none md:p-4 md:pt-4'>
                <div className="flex w-full justify-evenly gap-2">
                    <RadioLabel label='2/4' name='meter' value='simple,duple' onChange={handleMeterChange} />
                    <RadioLabel label='3/4' name='meter' value='simple,triple' onChange={handleMeterChange} />
                    <RadioLabel label='4/4' name='meter' value='simple,quadruple' onChange={handleMeterChange} defaultChecked/>
                </div>
                <div className="flex w-full justify-evenly gap-2">
                    <RadioLabel label='6/8' name='meter' value='compound,duple' onChange={handleMeterChange}/>
                    <RadioLabel label='9/8' name='meter' value='compound,triple' onChange={handleMeterChange}/>
                    <RadioLabel label='12/8' name='meter' value='compound,quadruple' onChange={handleMeterChange}/>
                </div>
                <div className="flex w-full justify-evenly gap-2">
                    <RadioLabel label='3+2' name='meter' value='asymetrical,3-2' onChange={handleMeterChange} />
                    <RadioLabel label='2+3' name='meter' value='asymetrical,2-3' onChange={handleMeterChange} />
                    <RadioLabel label='4+3' name='meter' value='asymetrical,4-3' onChange={handleMeterChange} />
                    <RadioLabel label='3+4' name='meter' value='asymetrical,3-4' onChange={handleMeterChange} />
                </div>
            </section>
        </div>
    </>
  )
}

export default Page