import type { Permission } from "@/api/profiles/get-permissions";
import { useMemo, useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
} from "../ui/card";

import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

import type { ProfileDetailsSchema } from "@/pages/profile-updated-page";
import type { Profile } from "@/pages/profiles-page";
import {
    ChevronDown,
    ChevronUp,
    FolderLock,
    Search,
} from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

interface ProfileMatrizComponentProps {
    permissions?: Permission[];
    profile?: Profile;
    form: UseFormReturn<ProfileDetailsSchema>;
    isLoading: boolean;
    isError: boolean;
}

interface GroupedPermission {
    module: string;
    permissions: Permission[];
}

export function ProfileMatrizComponent({
    permissions = [],
    form
}: ProfileMatrizComponentProps) {
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const { watch, setValue } = form;

    const selectedPermissions = watch("permissions");

    const grouped = useMemo<GroupedPermission[]>(() => {
        const groups: Record<string, Permission[]> = {};

        permissions.forEach((permission) => {
            const module = permission.key.split(".")[0];

            if (!groups[module]) groups[module] = [];

            groups[module].push(permission);
        });

        return Object.entries(groups).map(([module, permissions]) => ({
            module,
            permissions,
        }));
    }, [permissions]);

    const filtered = grouped
        .map((group) => ({
            ...group,
            permissions: group.permissions.filter((permission) =>
                permission.key
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        }))
        .filter((group) => group.permissions.length);

    function prettify(text: string) {
        return text
            .replaceAll("_", " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    function toggleModule(module: string) {
        setExpanded((old) => ({
            ...old,
            [module]: !old[module],
        }));
    }

    return (
        <Card className={`h-fit w-full flex flex-col items-center justify-start border border-border rounded-lg shadow-sm transition-all duration-300 transform hover:scale-[1.01]
                        hover:shadow-sm gap-6 bg-(image:--background-gradient)`}>
            <CardHeader className="w-full space-y-4">
                <div>
                    <h2 className="text-lg font-bold">
                        Matriz de Permissões
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Gerencie as permissões de acesso por módulo.
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <Input
                        placeholder="Buscar módulo ou permissão..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </CardHeader>

            <CardContent className="w-full space-y-4">
                {filtered.map((group) => {
                    const opened = expanded[group.module] ?? true;

                    return (
                        <div
                            key={group.module}
                            className="border rounded-xl bg-transparent"
                        >
                            <button
                                className="w-full flex items-center justify-between p-5"
                                onClick={() =>
                                    toggleModule(group.module)
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <FolderLock
                                            size={18}
                                            className="text-primary"
                                        />
                                    </div>

                                    <div className="text-left">
                                        <h3 className="font-semibold">
                                            {prettify(group.module)}
                                        </h3>

                                        <Badge
                                            variant="outline"
                                            className="mt-1"
                                        >
                                            {group.permissions.length} permissões
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge>
                                        {
                                            group.permissions.filter(permission =>
                                                selectedPermissions.includes(permission.id)
                                            ).length
                                        }
                                        /
                                        {group.permissions.length}
                                        {" "}
                                        ativas
                                    </Badge>

                                    {opened ? (
                                        <ChevronUp size={18} />
                                    ) : (
                                        <ChevronDown size={18} />
                                    )}
                                </div>
                            </button>

                            {opened && (
                                <div className="border-t grid md:grid-cols-2">
                                    {group.permissions.map(
                                        (permission) => {
                                            const action =
                                                permission.key.split(
                                                    "."
                                                )[1];

                                            return (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-center justify-between p-4 border-b last:border-b-0 md:odd:border-r"
                                                >
                                                    <div>
                                                        <h4 className="font-medium flex items-center gap-4">
                                                            {prettify(
                                                                action
                                                            )} - <p className="text-xs text-muted-foreground">
                                                                {
                                                                    permission.key
                                                                }
                                                            </p>
                                                        </h4>

                                                        <span className="text-[.8rem] text-muted-foreground">{permission.description}</span>


                                                    </div>

                                                    <Switch
                                                        checked={selectedPermissions.includes(permission.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setValue("permissions", [
                                                                    ...selectedPermissions,
                                                                    permission.id,
                                                                ]);
                                                            } else {
                                                                setValue(
                                                                    "permissions",
                                                                    selectedPermissions.filter(
                                                                        id => id !== permission.id
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}