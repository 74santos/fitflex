import  { Metadata } from "next"
import { notFound } from "next/navigation"
import { getUserById } from "@/lib/actions/user.actions"
import UpdateUserForm from "./update-user-form"

export const metadata: Metadata = {
  title: "Update User",
}

export default async function AdminUserUpdatePage(props:{
  params: Promise<{
    id: string
  }>
}) {

  const { id } = await props.params

  const user = await getUserById(id)

  if(!user) notFound()
  
  console.log(user)

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="font-bold text-3xl text-center">Update User</h2>
      <UpdateUserForm  user={user}/>
    </div>
  )}