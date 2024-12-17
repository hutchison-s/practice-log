'use client'
import PageTitle from '@/app/ui/components/PageTitle'
import { Music2, Music3, PlayCircle, StopCircle } from 'lucide-react';
import React, { PointerEvent, useEffect, useRef, useState } from 'react'

type Pitch = 'high' | 'mid' | 'low'
const meterMap: Record<string, Pitch[]> = {
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

function Page() {
    const [tempo, setTempo] = useState(120);
    const [subType, setSubType] = useState(1);
    const [meter, setMeter] = useState<Pitch[]>(['high', 'low', 'mid', 'low', 'mid', 'low', 'mid', 'low'])
    const [isMoving, setIsMoving] = useState(false);
    const [player, setPlayer] = useState<NodeJS.Timeout | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null)
    const tones = useRef<Record<Pitch, HTMLAudioElement | null>>({
        high: null,
        mid: null,
        low: null
    });

    useEffect(()=>{
        const slider = sliderRef.current;
        if (!slider) return;
        // const handleScroll = (e: Event) => {
        //     if (isMoving) e.preventDefault()
        // }
        slider.addEventListener('touchstart', handleTouchStart);
        slider.addEventListener('touchmove', handleMove);
        window.addEventListener('pointerup', stopMoving);
        window.addEventListener('touchend', stopMoving);
        // window.addEventListener('scroll', handleScroll)
        return ()=>{
            window.removeEventListener('pointerup', stopMoving)
            window.removeEventListener('touchend', stopMoving)
            slider.removeEventListener('touchstart', handleTouchStart);
            slider.removeEventListener('touchmove', handleMove);
        }
    }, [sliderRef.current])

    useEffect(() => {
        tones.current.high = document.getElementById('high_note') as HTMLAudioElement | null;
        tones.current.mid = document.getElementById('mid_note') as HTMLAudioElement | null;
        tones.current.low = document.getElementById('low_note') as HTMLAudioElement | null;
    }, []);

    useEffect(()=>{
        if (player) {
            stop();
            play();
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
        
        setMeter(meterMap[target.value]);
    }

    function handleSubdivisionChange() {
        const target = document.querySelector('input[type="radio"][name="subdivision"]:checked') as HTMLInputElement;
        setSubType(parseInt(target.value))
    }

    function handleTogglePlay() {
        console.log(tones)
        if (player) {
            stop()
        } else {
            play()
        }
    }

    function playTone(tone: Pitch) {
        const audio = tones.current[tone];
        if (audio) {
            audio.currentTime = 0;
            audio.volume = tone == 'low' ? 0.2 : 1;
            audio.play();
        }
    }
    

    function play() {
        const beat = 60000 / tempo;
        const isCompound = (document.querySelector('input[type="radio"][name="meter"]:checked') as HTMLInputElement)
            .value.split(',')[0] === 'compound';
        const subdivisionLength = isCompound ? beat / 3 : beat / 2;
        let index = 0;
        let nextTick = performance.now() + subdivisionLength
        
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
            const now = performance.now();
            if (now >= nextTick) {
                playNextTone()
                nextTick += subdivisionLength;
                if (now > nextTick) {
                    nextTick = now + subdivisionLength;
                }
            }
            setPlayer(setTimeout(loop, nextTick - now))
        }
        
    
        setPlayer(setTimeout(loop, subdivisionLength));
    }
    
    function stop() {
        clearTimeout(player!);
        setPlayer(null);
    }

    const stopMoving = ()=>{
        setIsMoving(false)
    }

    const handleMove = (e: PointerEvent<HTMLDivElement> | TouchEvent)=>{
        if (isMoving) {
            const target = e.currentTarget as HTMLDivElement;
            const {bottom} = target.parentElement!.getBoundingClientRect();
            const clickY = 'touches' in e ? e.touches[0].pageY : e.pageY;
            const offset = (bottom + window.scrollY) - clickY;
            const centerOffset = target.clientHeight / 2;
            let newY = offset - centerOffset;
            console.log('bottom of track:', bottom + scrollY, "| pageY:", clickY, '| newY:', newY)
            newY = Math.max(0, newY);
            newY = Math.min(240, newY);
            target.style.bottom = `${newY}px`
            const percent = (newY / 240)
            const newTempo = Math.round(percent * 200) + 40
            setTempo(newTempo)
        }
    }

    const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault()
        setIsMoving(true)
    }


  return (
    <>
        <PageTitle>Metronome</PageTitle>
        <div className="flex w-full justify-even flex-wrap md:flex-nowrap">
            
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
                        {player
                            ? <StopCircle size={120} className='drop-shadow' />
                            : <PlayCircle size={120} className='drop-shadow'/>}
                    </button>
                </div>
                <div className='h-[300px] w-8 relative bg-background rounded'>
                    <div
                        ref={sliderRef} 
                        className='absolute w-10 h-16 bottom-0 -left-1 bg-primary border-2 border-background outline outline-2 outline-primary rounded'
                        style={{bottom: '100px'}}
                        onPointerDown={()=>setIsMoving(true)}
                        onPointerMove={(e)=>handleMove(e)}
                        onTouchEnd={stopMoving}
                    >

                    </div>
                </div>
                
            </section>
            <section className='flex-1 border-2 border-secondary grid gap-2 p-2 pt-6 rounded-b-xl md:rounded-r-xl md:rounded-bl-none md:p-4 md:pt-4'>
                <div className="flex w-full justify-evenly gap-2">
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        2/4
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="2-4-meter" value="simple,duple"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        3/4
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="3-4-meter" value="simple,triple"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        4/4
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="4-4-meter" value="simple,quadruple" defaultChecked/>
                    </label>
                </div>
                <div className="flex w-full justify-evenly gap-2">
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        6/8
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="6-8-meter" value="compound,duple"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        9/8
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="9-8-meter" value="compound,triple"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        12/8
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="12-8-meter" value="compound,quadruple"/>
                    </label>
                </div>
                <div className="flex w-full justify-evenly gap-2">
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        3+2
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="5-8-3-2-meter" value="asymetrical,3-2"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        2+3
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="5-8-2-3meter" value="asymetrical,2-3"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        4+3
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="7-8-4-3-meter" value="asymetrical,4-3"/>
                    </label>
                    <label className='p-4 grid place-items-center font-xl bg-secondary rounded-xl w-full cursor-pointer radio-label'>
                        3+4
                        <input hidden type="radio" onChange={handleMeterChange} name="meter" id="7-8-3-4-meter" value="asymetrical,3-4"/>
                    </label>
                </div>
            </section>
        </div>
        <audio src='/audio/high.mp3' id='high_note'/>
        <audio src='/audio/mid.mp3' id='mid_note'/>
        <audio src='/audio/low.mp3' id='low_note'/>
    </>
  )
}

export default Page