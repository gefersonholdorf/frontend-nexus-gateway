import { Handle, Position } from "@xyflow/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  data: {
    name: string;
    role: string;
    image: string;
  };
}

export default function EmployeeNode({ data }: Props) {
  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div
        style={{
          width: 170,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        <Avatar className="h-18 w-18 border-4 border-primary/60">
          <AvatarImage src={data.image} className="w-full h-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <strong
          style={{
            color: "#1565c0",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {data.name}
        </strong>

        <span className="text-[.7rem] text-muted-foreground">
          {data.role}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
}