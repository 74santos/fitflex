import { Metadata } from "next";
import ProfileForm from "./profile-form";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export const metadata: Metadata = {
  title: "Customer Profile",
}


export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
   

    <div className="max-w-md mx-auto space-y-4">

      <h1 className="text-2xl font-bold">Profile</h1>
      <ProfileForm />
    </div>
  );
}