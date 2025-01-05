'use client'
import { useUser } from '@/app/_usercontext/useUser';
import { PrimaryButton } from '@/app/ui/components/Buttons'
import { useRouter } from 'next/navigation';
import React from 'react'

function DeleteButton() {
    const router = useRouter()
    const {logout, user} = useUser()
    async function handleDelete() {
        await fetch(`/api/teachers/${user.id}`, {method: 'DELETE'});
        logout();
        router.push('/')
    }
  return (
    <PrimaryButton onClick={handleDelete}>Delete Account</PrimaryButton>
  )
}

export default DeleteButton