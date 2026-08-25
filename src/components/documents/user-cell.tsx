import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface UserCellUser {
    id: number
    name: string
    avatarUrl: string | null
    roleDescription: string | null
}

interface UserCellProps {
    user: UserCellUser | null
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part)
        .join("")
        .toUpperCase()
}

export function UserCell({ user }: UserCellProps) {
    if (!user) {
        return <span className="text-sm text-muted-foreground">---</span>
    }

    const initials = getInitials(user.name)

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex max-w-40 items-center gap-2 min-w-0">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                        <AvatarFallback className="bg-primary/90 text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">{user.name}</span>

                        {user.roleDescription && (
                            <span className="truncate text-[.8rem] text-muted-foreground">
                                {user.roleDescription}
                            </span>
                        )}
                    </div>
                </div>
            </TooltipTrigger>

            <TooltipContent>
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>

                    {user.roleDescription && (
                        <span className="text-xs">
                            {user.roleDescription}
                        </span>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}