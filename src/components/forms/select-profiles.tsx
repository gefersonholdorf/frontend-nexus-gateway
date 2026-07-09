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
                    <SelectItem value="all">
                        Todos
                    </SelectItem>

                    {profiles.map((profile) => (
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