import PageTitle from "@/app/ui/components/PageTitle"
import { Loader } from "lucide-react"

function loading() {
  return (
    <>
        <PageTitle>Teacher Portal</PageTitle>
        <p>Loading profile...</p>
        <div className="spinner text-lighter">
            <Loader aria-label="Loader" size={120}/>
        </div>
        <div className="w-full max-w-[1000px] min-h-[200px] grid grid-cols-1 lg:grid-cols-2">
        <section className="flex flex-col w-full max-w-[600px] gap-2 p-3 border-2 border-white/25 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"></section>
        <section className="w-full max-w-[600px] glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none"></section>
        </div>
    </>
  )
}

export default loading