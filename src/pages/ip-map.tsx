import { useQuery, useQueryClient } from "@tanstack/react-query"


export function IpMapPage() {
    const queryClient = useQueryClient()

    const query = useQuery(
        {
            queryKey: ['todos'],
            queryFn: async () => {
                const data = await fetch('http://10.188.15.38:9000/api/endpoints/2/docker/containers/json?all=troe')

                const result = data.json()

                console.log(result)
            }
        }
    )

    const select = query

    return (
        <div>
            teste
        </div>
    )
}