import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { useAllProfiles } from "@/hooks/useProfile";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Progress } from "../../ui/progress";

type TeamMember = {
  name: string;
  riskScore: number;
  reactionIndex: number;
  proceduralDiscipline: number;
  state: string;
  email: string;
};

const fallbackData: TeamMember[] = [
  {
    name: "Trabajador 1",
    email: "trabajador1@example.com",
    riskScore: 98,
    reactionIndex: 75,
    proceduralDiscipline: 60,
    state: "Alto Riesgo",
  },
  {
    name: "Trabajador 2",
    email: "trabajador2@example.com",
    riskScore: 20,
    reactionIndex: 75,
    proceduralDiscipline: 60,
    state: "Bajo Riesgo",
  },
  {
    name: "Trabajador 3",
    email: "trabajador3@example.com",
    riskScore: 50,
    reactionIndex: 33,
    proceduralDiscipline: 80,
    state: "Medio Riesgo",
  },
];

const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: "Trabajador",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback>
            {row.getValue("name")?.toString().charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p>{row.getValue("name")}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "riskScore",
    header: "Risk Score",
    cell: ({ row }) => (
      <div className="w-24 flex flex-col items-start gap-1">
        <p>
          <span className="font-bold">{row.getValue("riskScore")}?</span> /100
        </p>
        <Progress
          value={Number(row.getValue("riskScore"))}
          className={(() => {
            const score = Number(row.getValue("riskScore"));
            if (score >= 70) return "[&>*]:bg-red-500";
            if (score >= 40) return "[&>*]:bg-yellow-500";
            return "[&>*]:bg-green-500";
          })()}
        />
      </div>
    ),
  },
  {
    accessorKey: "reactionIndex",
    header: "Reacción",
    cell: ({ row }) => <span>{row.getValue("reactionIndex")}?/100</span>,
  },
  {
    accessorKey: "proceduralDiscipline",
    header: "Disciplina",
    cell: ({ row }) => <span>{row.getValue("proceduralDiscipline")}?/100</span>,
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => (
      <Badge
        className={(() => {
          const state = row.getValue("state");
          switch (state) {
            case "Alto Riesgo":
              return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
            case "Medio Riesgo":
              return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
            case "Bajo Riesgo":
              return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
            default:
              return "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300";
          }
        })()}
      >
        {row.getValue("state")}?
      </Badge>
    ),
  },
];

export const SupervisorTeamRecap: React.FC = () => {
  const { data: profiles } = useAllProfiles();

  const mappedData = React.useMemo<TeamMember[]>(() => {
    if (!profiles) return fallbackData;
    const employeeProfiles = profiles.filter((p: any) => p.role === "WORKER");
    return employeeProfiles.map((p: any) => ({
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      riskScore: Math.floor(Math.random() * 100), // Default for now
      reactionIndex: Math.floor(Math.random() * 100), // Default
      proceduralDiscipline: Math.floor(Math.random() * 100), // Default
      state: "Bajo Riesgo", // Default
    }));
  }, [profiles]);

  const table = useReactTable<TeamMember>({
    data: mappedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfiles de Riesgo del Equipo</CardTitle>
        <CardDescription>
          Evaluación conductual basada en simulaciones completadas
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin Resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
