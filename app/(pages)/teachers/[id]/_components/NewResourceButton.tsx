'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../../../_ui_components/layout/Buttons";
import { Plus, Upload } from "lucide-react";
import { Resource } from "@/app/types";
import { Resources } from "@/app/api/_controllers/tableControllers";

function NewResourceButton({student_id, onCreate}: {student_id?: string, onCreate: (r: Resource)=>void}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasError, setHasError] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [fileName, setFileName] = useState('audio, video, image, or pdf (max 12 MB)');
    const modalRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        if (isSubmitting) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isSubmitting])

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
            onCreate(newResource)
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
            onCreate(newResource)
        })
        .catch(err => {
            console.error(err);
        })
        .finally(()=>{
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
        <SecondaryButton onClick={()=>{setIsSubmitting(true)}} size="sm" 
                className="relative flex justify-between items-center mx-auto px-4 my-4 min-w-48">Add Resource<Plus aria-label="Plus Mark" /></SecondaryButton>
        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="grid gap-4"
            >
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
                    setIsSubmitting(false);
                    setFileName('audio, video, image, or pdf (max 12 MB)');
                    formRef.current?.reset();
                }}>Cancel</SecondaryButton>
            </form>
        </dialog>   
    </>
  )
}

export default NewResourceButton