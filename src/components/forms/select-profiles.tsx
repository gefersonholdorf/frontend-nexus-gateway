import { useMemo } from "react";
import { useUser } from "@/contexts/user-context";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface Profile {
    id: number;
    name: string;
}

interface SelectProfilesProps {
    profiles: Profile[];
    value?: string;
    onChange: (value: string) => void;
}

export function SelectProfiles({
    profiles,
    value,
    onChange,
}: SelectProfilesProps) {
    const { user } = useUser();

    const isAdmin = user?.roles.includes("Administrador");

    const availableProfiles = useMemo(() => {
        if (isAdmin) return profiles;

        return profiles.filter(profile =>
            user?.roles?.includes(profile.name)
        );
    }, [profiles, user?.roles, isAdmin]);

    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>

               <SelectContent>
                <SelectGroup>
                    {isAdmin && (
                        <SelectItem value="all">
                            Todos
                        </SelectItem>
                    )}

                    {availableProfiles.map((profile) => (
                        <SelectItem
                            key={profile.id}
                            value={String(profile.id)}
                        >
                            {profile.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}