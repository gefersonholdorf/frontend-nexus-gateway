import { Input } from "./ui/input";

export function MenuComponent({ onSetFiltering }: { onSetFiltering?: (value: string) => void }) {
    return (
        <div className="w-full grid grid-cols-3 gap-6 justify-between px-10 py-2 h-20 bg-white items-center border-b border-zinc-200 shadow-sm">
            <img src="./logo.png" className="w-50 p-2" />
            <Input
                placeholder="Pesquisar Serviços ou Sistema..."
                className="w-full"
                onChange={(e) => onSetFiltering && onSetFiltering(e.target.value)}
            />
            <div className="w-fit justify-self-end px-2 border border-zinc-200 bg-zinc-100 rounded-sm">
                <span className="text-zinc-400 text-[.8rem] font-medium">v1.0.0</span>
            </div>
        </div>
    )
}