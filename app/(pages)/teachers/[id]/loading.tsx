import PageTitle from "@/app/_ui_components/layout/PageTitle"
import { Loader } from "lucide-react"

function loading() {
  return (
    <>
        <PageTitle>Teacher Portal</PageTitle>
        <p>Loading profile...</p>
        <section className="w-full grid place-content-center min-w-[300px] md:min-w-[600px] mx-auto">

          

          <div className="w-full max-w-[1000px] min-h-[200px] grid grid-cols-1 lg:grid-cols-2 min-w-[300px] md:min-w-[800px]">
          <section className="flex flex-col w-full max-w-[800px] gap-2 p-3 border-2 border-white/25 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
            <div className="w-full min-w-[300px] h-12 bg-white/5 rounded-xl shimmer">
            </div>
            <div className="w-full min-w-[300px] h-12 bg-white/5 rounded-xl shimmer">
            </div>
            <div className="w-full min-w-[300px] h-12 bg-white/5 rounded-xl shimmer">
            </div>
          </section>
          <section className="w-full max-w-[600px] glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none">
            <Loader aria-label="Loader" size={120} className='text-teal-700 animate-spin mx-auto my-8'/>
          </section>
          </div>
        </section>
    </>
  )
}

export default loading