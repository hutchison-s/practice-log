'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../../../_ui_components/layout/Buttons";
import { Loader, Plus, Upload } from "lucide-react";
import { Resource } from "@/app/types";
import { Resources } from "@/app/api/_controllers/tableControllers";
import LibraryResourceChooser from "./LibraryResourceChooser";
import ControlledModalForm from "@/app/_ui_components/forms/ControlledModalForm";

function NewResourceButton({student_id, onCreate}: {student_id: string, onCreate: (r: Resource)=>void}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasError, setHasError] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [fileName, setFileName] = useState('audio, video, image, or pdf (max 12 MB)');
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        if (hasError) {
            setTimeout(()=>{
                setHasError('')
            }, 2500)
        }
    }, [hasError])

    function createResourceRow(
        key: string,
        url: string,
        type: string,
        student_id: string,
        title: string
    ) {
        Resources(student_id).createOne({
                key,
                url,
                type,
                student_id,
                title
            })
        .then(newResource => {
            console.log('Created new Resource:', newResource.id, newResource.type, newResource.url);
            fetch(`/api/teachers/${newResource.created_by}/library/resources`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({key, url, type, title})})
                .then(()=>{
                    onCreate(newResource);
                })
            
        })
    }

    function handleNewLink(title: string, content: string) {
        if (!content) {
            setHasError('You must provide a valid URL.')
            return;
        }
        if (!student_id) return;
        Resources(student_id).createOne({
                key: `${title}-link-${Date.now()}`,
                url: content as string,
                type: 'link',
                student_id: student_id,
                title: title
            })
        .then(newResource => {
            fetch(`/api/teachers/${newResource.created_by}/library/resources`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({key: newResource.key, url: newResource.url, type: newResource.type, title: newResource.title})})
                .then(()=>{
                    onCreate(newResource);
                })
        })
        .catch(err => {
            console.error(err);
        })
        .finally(()=>{
            setIsOpen(false)
            setIsSubmitting(false)
        })
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
                            createResourceRow(key, downloadURL, content.type, student_id as string, title)
                        }
                    })
                    .catch(err => console.error(err))

            }).catch(err => {
                console.error(err)
            }).finally(()=>{
                setIsOpen(false)
                setIsSubmitting(false);
            })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
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
        <SecondaryButton onClick={()=>{setIsOpen(true)}} size="sm" 
                className="relative flex justify-between items-center mx-auto px-4 my-4 min-w-48">Add Resource<Plus aria-label="Plus Mark" /></SecondaryButton>
        <ControlledModalForm
                isOpen={isOpen}
                handleSubmit={handleSubmit}
                formClassName="grid gap-4"
            >
                {
                    isSubmitting ? <Loader size={80} className="text-teal-500 mx-auto my-6 animate-spin"/> :
                    <>
                <LibraryResourceChooser student_id={student_id} onAssign={(r: Resource)=>{onCreate(r); setIsOpen(false)}}/>
                <p className="text-center">- or -</p>
                {hasError && <p className="text-red-400">{hasError}</p>}
                <p className="text-center font-inter font-light text-zinc-400">Create a new resource</p>
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
                }}>Cancel</SecondaryButton>
            </>}
            </ControlledModalForm> 
    </>
  )
}

export default NewResourceButton