import { Handle, Position } from "@xyflow/react";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  data: {
    name: string;
    role: string;
    image: string;
    isComite: boolean
  };
}

export default function EmployeeNode({ data }: Props) {
  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div className="relative p-4 flex flex-row border border-border bg-(image:--background-gradient) shadow-lg w-70 h-fit rounded-lg">
        <div className="w-90 flex justify-start gap-4 items-center">

          <Avatar className="h-18 w-18 border-4 border-primary/60">
            <AvatarImage src={data.image} className="w-full h-full" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex flex-col w-full">
            {data.isComite && (
              <span className="absolute top-2 right-2 bg-card text-purple-500 border border-border px-2 py-1 rounded-sm text-[.6rem] font-medium flex gap-2 items-center">
                <Users className="size-3" />
                COMITÊ SGSI
              </span>
            )}
            <strong className={`${data.isComite && "mt-4"}`}
              style={{
                color: "#1565c0",
                textAlign: "start",
                fontSize: 14,
              }}
            >
              {data.name}
            </strong>

            <span className="text-[.8rem] text-muted-foreground">
              {data.role}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
}