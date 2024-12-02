'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { Plus } from "lucide-react";
import { Resource } from "@/app/types";

function NewResourceButton({student_id, onCreate}: {student_id?: string, onCreate: (r: Resource)=>void}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(()=>{
        if (isSubmitting) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isSubmitting])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const title = fd.get('title');
        const content = fd.get('content');

        if (!content || !title) {
            return console.log('missing required info', content, title);
        }
        if (isLink) {
            fetch(`/api/resources`, {
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({
                    key: `${title}-link-${Date.now()}`,
                    url: content as string,
                    resource_type: 'link',
                    student_id: student_id,
                    title: title
                })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('could not create db reference')
                }
            })
            .then(json => {
                console.log('Created new Resource:', json.data.id, json.data.type, json.data.url);
                onCreate(json.data as Resource)
            })
            .catch(err => {
                console.error(err);
            })
            .finally(()=>{
                setIsSubmitting(false)
                
            })
        } else {
            const f = content as File;
            fetch('/api/s3?file='+f.name)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('bad response: '+res.status)
                    }
                    return res.json()
                }).then(json => {
                    const {key, url, downloadURL} = json.data;
                    fetch(url, {method: 'PUT', body: f})
                        .then(res => {
                            if (res.ok) {
                                fetch('/api/resources', {
                                    method: 'POST', 
                                    headers: {'Content-Type': 'application/json'}, 
                                    body: JSON.stringify({
                                        key,
                                        url: downloadURL,
                                        resource_type: f.type,
                                        student_id: student_id,
                                        title: title
                                    })
                                })
                                .then(res => {
                                    if (res.ok) {
                                        return res.json();
                                    } else {
                                        throw new Error('could not create db reference')
                                    }
                                })
                                .then(json => {
                                    console.log('Created new Resource:', json.data.id, json.data.type, json.data.url);
                                    onCreate(json.data as Resource)
                                })
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
    }
  return (
    <>
        <PrimaryButton onClick={()=>{setIsSubmitting(true)}} className="flex justify-between mx-auto px-4 min-w-48">Add Resource<Plus /></PrimaryButton>
        <dialog ref={modalRef} className="size-full bg-transparent fixed max-w-[400px] max-h-[600px]">
            <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="size-full grid gap-4 items-center justify-items-center bg-secondary border-2 border-txtprimary shadow-lg rounded-lg p-8 text-txtprimary"
            >
                <div className="grid gap-2 w-full">
                    <label htmlFor="title" className="w-full font-bold text-center">Resource Title</label>
                    <input type="text" name="title" id="title" maxLength={120} className="w-full bg-black/25 rounded border-txtsecondary border-[1px] p-2"/>
                </div>
                <div className="grid gap-2 w-full">
                    <div className="flex justify-evenly w-full rounded border-2 border-txtsecondary">
                        <button onClick={()=>{setIsLink(false)}} className='flex-1' style={{background: isLink ? 'rgb(var(--secondary))' : 'rgb(var(--primary))'}}>File</button>
                        <button onClick={()=>{setIsLink(true)}} className='flex-1' style={{background: isLink ? 'rgb(var(--primary))' : 'rgb(var(--secondary))'}}>Link</button>
                    </div>
                    <label htmlFor="content" className="w-full font-bold text-center">{isLink ? "Paste Link Below" : "Choose File"}</label>
                    
                    {isLink
                        ? <input type="text" name="content" id="content"  className="w-full bg-black/25 rounded border-txtsecondary border-[1px] p-2"/>
                        : <input type="file" accept="image/*, video/*, application/pdf, audio/*" name="content" id="content" className="w-full"/>}
                </div>
                <PrimaryButton size="md" type="submit" onClick={undefined}>Submit</PrimaryButton>
                <SecondaryButton size="md" type="reset" onClick={()=>setIsSubmitting(false)}>Cancel</SecondaryButton>
            </form>
        </dialog>   
    </>
  )
}

export default NewResourceButton