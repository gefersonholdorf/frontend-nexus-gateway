import { BackComponent } from "@/components/back-component"
import { Calendar } from "@/components/ui/calendar"
import { Calendar1 } from "lucide-react"

export function CalendarPage() {
    return (
        <>
            <div className="px-10 flex justify-start items-start border-b border-zinc-100 bg-white p-4 rounded-lg">
                <div className="flex gap-3 items-center">
                    <BackComponent />
                    <div className="w-10 h-10 border border-blue-600 rounded-md overflow-hidden flex items-center justify-center bg-blue-100">
                        <Calendar1 className="text-blue-600 size-4" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Calendário</h1>
                        <p className="text-gray-600 text-[.8rem]">Mantenha-se informado sobre eventos, reuniões e marcos importantes da empresa.</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 border grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 px-16">
                <div className="lg:col-span-2">
                    <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        className="rounded-lg border"
                    />
                </div>
                <div className="lg:col-span-1">
                    <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        className="rounded-lg border"
                    />
                </div>
                <div className="lg:col-span-1">
                    <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        className="rounded-lg border"
                    />
                </div>
            </div >
        </>
    )
}