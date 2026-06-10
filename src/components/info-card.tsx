import type React from "react";
import { Card } from "./ui/card";

interface InfoCardProps {
    title: string
    quantity: string
    children: React.ReactNode
}

export function InfoCard({ title, quantity, children }: InfoCardProps) {
    return (
        <Card
            className={`
                rounded-2xl border border-slate-200 p-3 shadow-sm flex gap-2 items-start transition-all duration-300 transform hover:scale-[1.01]
                hover:shadow-lg`}
        >
            <div className="flex gap-2 items-center">
                {children}
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                    <span className="text-[.8rem] font text-primary-text">{title}</span>
                </div>
            </div>
        </Card>
    )
}