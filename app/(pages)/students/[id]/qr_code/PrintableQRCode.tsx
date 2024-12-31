'use client'
import { PrimaryButton } from '@/app/ui/components/Buttons';
import { Download } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

function PrintableQRCode({name, course, imageURL, width = 150}: {name: string, course: string, imageURL: string, width?: number}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

    useEffect(()=>{
            if (!canvasRef.current) return;
            setCtx(canvasRef.current.getContext('2d'));
    }, [canvasRef.current])

    useEffect(()=>{
        if (!ctx || !canvasRef.current) return;
        const img = new Image();
        img.width = width;
        img.height = width;
        img.src = imageURL;
        img.onload = ()=>{
            const canvas = canvasRef.current as HTMLCanvasElement;
            canvas.width = width + 20;
            canvas.height = width + 90;
            ctx.fillStyle = 'white'
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.drawImage(img, 10, 10) // 10px border
            ctx!.font = `${Math.round(0.08 * width)}px Arial`;
            ctx!.fillStyle = 'black';
            ctx!.lineWidth = 3;
            ctx!.textAlign = 'center';
            ctx!.fillText(name, canvas.width / 2, canvas.height - 60);
            ctx.fillStyle = '#888888';
            ctx!.fillText(course, canvas.width / 2, canvas.height - 30);
            
        };

    }, [ctx])

    const download = () => {
            // Trigger download
            if (!canvasRef.current) return;
            const link = document.createElement('a');
            link.download = `${name}-qr-code.png`;
            link.href = canvasRef.current.toDataURL('image/png');
            link.click();
        };

    return (
        <div className='qr-code mx-auto'>
            <canvas ref={canvasRef} className='rounded overflow-hidden mx-auto my-4 print:my-0'></canvas>
            <div className='w-full flex justify-evenly no-print'>
                <PrimaryButton onClick={download} size='md' className='flex gap-4'>Download <Download /></PrimaryButton>
            </div>
        </div>
    );
}

export default PrintableQRCode