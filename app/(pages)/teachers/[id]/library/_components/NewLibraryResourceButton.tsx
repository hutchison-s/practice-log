'use client'

import { useUser } from '@/app/_hooks/useUser'
import ControlledModalForm from '@/app/_ui_components/forms/ControlledModalForm'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import { Loader, Plus, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useRef, useState } from 'react'

function NewLibraryResourceButton() {
    const {user} = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [hasError, setHasError] = useState('');
        const [isLink, setIsLink] = useState(false);
        const [fileName, setFileName] = useState('audio, video, image, or pdf (max 12 MB)');
        const formRef = useRef<HTMLFormElement>(null);
        const fileRef = useRef<HTMLInputElement>(null)
    
        useEffect(()=>{
            if (hasError) {
                setTimeout(()=>{
                    setHasError('')
                }, 2500)
            }
        }, [hasError])

        useEffect(()=>{
            formRef.current?.reset();
        }, [isLink])
    
        function createResourceRow(
            key: string,
            url: string,
            type: string,
            title: string
        ) {
            fetch(`/api/teachers/${user.id}/library/resources`, {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({key, url, type, title})})
            .then(()=>{
                router.refresh();
                setIsOpen(false)
            })
            .finally(()=>setIsSubmitting(false));
        }
    
        function handleNewLink(title: string, content: string) {
            if (!content) {
                setHasError('You must provide a valid URL.')
                return;
            }
            setIsSubmitting(true)
            createResourceRow(
                `${title}-link-${Date.now()}`,
                content as string,
                'link',
                title
            )
        }
    
        function handleNewFile(title: string, content: File) {
            if (content.size > (1024 * 1024 * 12)) {
                setHasError('File is larger than 12mb limit');
                return;
            };
            if (content.size == 0) {
                setHasError('File must be provided')
                return;
            }
            setIsSubmitting(true)
            fetch(`/api/s3?file=${content.name}&size=${content.size}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('bad response: '+res.status)
                    }
                    return res.json()
                }).then(json => {
                    const {key, url, downloadURL} = json.data;
                    fetch(url, {method: 'PUT', body: content})
                        .then(res => {
                            if (res.ok) {
                                createResourceRow(key, downloadURL, content.type, title)
                            }
                        })
                        .catch(err => console.error(err))
    
                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                    setIsSubmitting(false)
                    formRef.current?.reset();
                })
        }
    
        const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const title = fd.get('title');
            const content = fd.get('content');
            if (isLink) {
                handleNewLink(title as string, content as string)
            } else {
                handleNewFile(title as string, content as File)
            }
        }

  return (
    <>
        <SecondaryButton
                onClick={()=>{
                    router.refresh()
                    setIsOpen(true)
                }}
                size="sm" 
                className="text-sm relative flex justify-between items-center px-2 py-1 my-4 min-w-40">
                    <span>Create Resource</span> <Plus aria-label="Plus Mark" size={20}/>
            </SecondaryButton>
        <ControlledModalForm isOpen={isOpen} handleSubmit={handleSubmit}>
            {isSubmitting
                ?   <Loader size={80} className='mx-auto text-teal-500 animate-spin'/>
                :   <>
                        {hasError && <p className="text-red-400">{hasError}</p>}
                <p className="text-center font-inter font-light text-zinc-400">Create a new resource for your library</p>
                <div className="grid gap-2 w-full">
                    <label htmlFor="title" className="w-full font-bold text-center text-white font-golos">Resource Title</label>
                    <input required type="text" name="title" id="title" maxLength={120} placeholder="Your resource title..." className="w-full bg-background/50 rounded border-white/25 border-[1px] p-2 text-inter text-zinc-400"/>
                </div>
                <div className="grid gap-2 w-full">
                    <div className="flex justify-evenly w-full rounded border-[1px] border-white/25">
                        <button role='button' onClick={(e)=>{e.preventDefault(); setIsLink(false)}} className='flex-1' style={{backgroundImage: isLink ? 'linear-gradient(-45deg, #171717, #171717)' : 'linear-gradient(-45deg, #1e1b4b, #3730a3)'}}>File</button>
                        <button role='button' onClick={(e)=>{e.preventDefault(); setIsLink(true)}} className='flex-1' style={{backgroundImage: isLink ? 'linear-gradient(-45deg, #1e1b4b, #3730a3)' : 'linear-gradient(-45deg, #171717, #171717)'}}>Link</button>
                    </div>
                    <label htmlFor="content" className="w-full font-bold text-center">{isLink ? "Paste Link Below" : "Choose File"}</label>
                    
                    {isLink
                        ? <input type="text" name="content" id="content" placeholder="https://www.example.com..." className="w-full bg-background/50 rounded border-white/25 border-[1px] p-2 text-inter text-zinc-400"/>
                        : <>
                            <input type="file" accept="image/*, video/*, application/pdf, audio/*" name="content" id="content" className="w-full" ref={fileRef} onChange={(e)=>{setFileName(e.currentTarget.files![0].name)}} hidden/>
                            <button type="button" className="mx-auto bg-gradient-to-br from-indigo-800 to-indigo-950 py-2 px-8 rounded border-[1px] border-white/25 drop-shadow" onClick={()=>{fileRef.current?.click()}}><Upload /></button>
                            <p className="w-full text-center"><small>{fileName}</small></p>
                          </>
                    }
                </div>
                <PrimaryButton size="md" type="submit" className='mx-auto' onClick={undefined}>Submit</PrimaryButton>
                <SecondaryButton size="sm" type="reset" className='mx-auto' onClick={()=>{
                    setIsOpen(false);
                    setFileName('audio, video, image, or pdf (max 12 MB)');
                    formRef.current?.reset();
                }}>Cancel</SecondaryButton>
                    </>
            }
            
        </ControlledModalForm>
    </>
  )
}

export default NewLibraryResourceButton