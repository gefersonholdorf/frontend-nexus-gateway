import { ServerCard } from "@/pages/servers-page";
import { useQuery } from "@tanstack/react-query";
import { Server, UserRound, Users, UserStar } from "lucide-react";
import { UserCard } from "./user-card";

interface UserPrivilege {
    username: string;
    name: string;
    group: string;
    status: string;
    last_login: string | null;
    privilegeActive: boolean
    dt_expires_at: Date | null
}

interface UsersPrivilegesServersResponse {
    serversUsersPrivileges: {
        server: string;
        users: UserPrivilege[];
    }[];
}

export interface UserServer {
    server: string;
    group: string;
    status: string;
    lastLogin: string | null;
    privilegeActive: boolean
    dt_expires_at: Date | null
}

export interface User {
    username: string;
    name: string;
    logo: string;
    servers: UserServer[];
}

export function UsersPrivilegesServers() {
    const servers = [
        "SERVER-BRA-HOM",
        "SERVER-BRA-APP",
        "SERVER-BRA-INFRA",
    ];

    const { data, isLoading, error } = useQuery({
        queryKey: ["server-user-privileges", servers],
        queryFn: async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/servers/privileges`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        servers,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar privilégios");
            }

            return response.json() as Promise<UsersPrivilegesServersResponse>;
        },
    });

    const usersMap = new Map<string, User>();

    data?.serversUsersPrivileges.forEach((serverData) => {
        serverData.users.forEach((serverUser) => {
            if (!usersMap.has(serverUser.username)) {
                usersMap.set(serverUser.username, {
                    username: serverUser.username,
                    name: serverUser.name,
                    logo: "https://api2.lusati.com.br/repositorio/nexus/geferson.png",
                    servers: [],
                });
            }

            const user = usersMap.get(serverUser.username);

            user?.servers.push({
                server: serverData.server,
                group: serverUser.group,
                status: serverUser.status,
                lastLogin: serverUser.last_login,
                privilegeActive: serverUser.privilegeActive,
                dt_expires_at: serverUser.dt_expires_at ?? null
            });
        });
    });

    const users = Array.from(usersMap.values());

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                Carregando usuários...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-10 text-red-500">
                Erro ao carregar usuários.
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="flex items-center justify-center py-10">
                Nenhum usuário encontrado.
            </div>
        );
    }

    return (
        <>
            <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-6 gap-6">
                <ServerCard color="blue" title="SERVIDORES" quantity={3}>
                    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <Server className="text-blue-500 size-5" />
                    </div>
                </ServerCard>
                <ServerCard color="emerald" title="USUÁRIOS" quantity={3}>
                    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <Users className="text-emerald-500 size-5" />
                    </div>
                </ServerCard>
                <ServerCard color="red" title="ADMIN" quantity={6}>
                    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <UserStar className="text-red-500 size-5" />
                    </div>
                </ServerCard>
                <ServerCard color="orange" title="READONLY" quantity={4}>
                    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <UserRound className="text-orange-500 size-5" />
                    </div>
                </ServerCard>
                <ServerCard color="yellow" title="DOCKER" quantity={4}>
                    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <UserRound className="text-yellow-500 size-5" />
                    </div>
                </ServerCard>
                <ServerCard color="purple" title="PRIVILÉGIOS" quantity={4}>
                    <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-primary/10">
                        <UserRound className="text-purple-500 size-5" />
                    </div>
                </ServerCard>
            </div>
            <div className="bg-background py-4 grid grid-cols-1 gap-6">
                {users.map((user) => (
                    <UserCard
                        key={user.username}
                        user={user}
                    />
                ))}
            </div>
        </>
    );
}