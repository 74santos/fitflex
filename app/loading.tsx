import Image
 from "next/image"  
 import loader from "@/assets/loader.gif"
export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={loader} alt="loading..." width={120} height={120} unoptimized/>
    </div>
  )
}