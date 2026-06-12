import { UserCard } from "./user-card";

const usersServer = [
    {
        id: 1,
        name: "Geferson Holdorf",
        user: "gholdorf",
        logo: "https://api2.lusati.com.br/repositorio/nexus/geferson.png"
    },
    {
        id: 2,
        name: "Marcelo Verdi",
        user: "mverdi",
        logo: "https://api2.lusati.com.br/repositorio/nexus/geferson.png"
    },
    {
        id: 3,
        name: "Roberto Amorim",
        user: "ramorim",
        logo: "https://api2.lusati.com.br/repositorio/nexus/geferson.png"
    },
    {
        id: 4,
        name: "Bruno Busarello",
        user: "bbusarello",
        logo: "https://api2.lusati.com.br/repositorio/nexus/bruno.png"
    }
]

export function UsersPrivilegesServers() {
    return (
        <div className="bg-background py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {usersServer.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    )
}