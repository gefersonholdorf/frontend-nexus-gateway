import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
} from "@/components/ui/drawer";
import {
    Loader2,
    AlertCircle,
    X
} from "lucide-react";
import DataMaskingFlowPage from "./masking-component";
import type { Masking } from "@/api/maskings/fetch-maskings";
import { useGetDataMasking } from "@/api/maskings/get-data-masking";

interface Props {
    open: boolean;
    onOpenChange: (masking: Masking | null) => void;
    masking: Masking | null;
}

export function DrawerMasking({
    open,
    onOpenChange,
    masking
}: Props) {

    const { data, isLoading, isError } = useGetDataMasking({
        executionId: masking?.path ?? "",
    });

    if (!masking) {
        return null;
    }

    return (
        <Drawer
            open={open}
            onOpenChange={(value) => {
                if (value) {
                    onOpenChange(masking);
                }
            }}
            dismissible={false}
            direction="right"
        >
            <DrawerContent className="min-w-3/4 ml-auto overflow-y-auto sidebar-scroll">

                <DrawerHeader className="flex flex-row items-center justify-between space-y-1">
                    <div className="flex flex-col">
                        <span className="font-semibold text-xl">
                            Log Completo de Execução
                        </span>

                        <span className="text-sm text-muted-foreground">
                            Execução - {masking.executionId} - {masking.dsEnvironment}
                        </span>
                    </div>

                    <Button
                        className="text-muted-foreground p-3 bg-transparent border border-border hover:text-white"
                        onClick={() => onOpenChange(null)}
                    >
                        <X />
                    </Button>
                </DrawerHeader>


                <div className="px-5 pb-6 space-y-6">

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-96 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />

                            <span className="text-muted-foreground">
                                Carregando dados da execução...
                            </span>
                        </div>
                    )}


                    {isError && (
                        <div className="flex flex-col items-center justify-center h-96 gap-3 text-destructive">
                            <AlertCircle className="h-8 w-8" />

                            <span>
                                Erro ao carregar os dados da execução.
                            </span>

                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                            >
                                Tentar novamente
                            </Button>
                        </div>
                    )}


                    {!isLoading && !isError && data && (
                        <DataMaskingFlowPage
                            data={data}
                        />
                    )}

                </div>

            </DrawerContent>
        </Drawer>
    );
}