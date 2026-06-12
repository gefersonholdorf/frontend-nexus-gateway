import { useQuery } from "@tanstack/react-query";
import { UserCard } from "./user-card";

interface UserPrivilege {
    username: string;
    name: string;
    group: string;
    status: string;
    last_login: string;
    logo: string
}

interface UsersPrivilegesServersResponse {
    serversUsersPrivileges: {
        server: string;
        users: UserPrivilege[];
    }[];
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
                "http://127.0.0.1:3336/servers/privileges",
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

    const usersMap = new Map<
        string,
        UserPrivilege & {
            servers: string[];
        }
    >();

    data?.serversUsersPrivileges.forEach((serverData) => {
        serverData.users.forEach((user) => {
            if (!usersMap.has(user.username)) {
                usersMap.set(user.username, {
                    ...user,
                    logo: 'https://api2.lusati.com.br/repositorio/nexus/geferson.png',
                    servers: [],
                });
            }

            usersMap.get(user.username)?.servers.push(serverData.server);
        });
    });

    const users = Array.from(usersMap.values());

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar usuários.</div>;
    }

    return (
        <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-1 gap-6">
            {users.map((user) => (
                <UserCard
                    key={user.username}
                    user={user}
                />
            ))}
        </div>
    );
}