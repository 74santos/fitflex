'use client';
import { useState } from "react";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";


export  default function DeleteDialog({
  id, 
  action
}: {
  id: string; 
  action: (id: string) => Promise<{success: boolean, message: string}>
}) {

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();


  const handleDeleteClick = async () => {
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    })
  }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending} className="ml-2">
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
         
         <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
           size='sm'
           disabled= {isPending}
           onClick={handleDeleteClick}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
         </AlertDialogFooter>


      </AlertDialogContent>
    </AlertDialog>
  )
}