import { useDeleteCampaign } from "@/api/campaigns/delete-campaign";
import type { Campaign } from "@/api/campaigns/fetch-campaigns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCampaignModalProps {
    campaign: Campaign
    children: React.ReactNode
}


export function DeleteCampaignModal({
    campaign,
    children
}: DeleteCampaignModalProps) {
    const [open, setOpen] = useState(false);
    const { mutateAsync, isPending } = useDeleteCampaign()

    async function handleDeleteCampaign() {
        try {
            await mutateAsync(campaign.id)

            toast.success("Campánha deletada com sucesso!", {
                position: "top-center",
                richColors: true,
            });
        } catch (error) {
            toast.error("Erro ao deletar Campanha!", {
                position: "top-center",
                richColors: true,
            });
        } finally {
            setOpen(false)
        }
    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <span>{children}</span>
                </DialogTrigger>
                <DialogContent
                    onClick={(e) => e.stopPropagation()}
                    className="w-2/5 p-2 z-50"
                >
                    <DialogHeader className="p-6">
                        <DialogTitle className="text-[.9rem]">
                            A campanha {campaign.title} será removido, deseja confirmar a deleção?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={isPending}
                            type="submit"
                            onClick={handleDeleteCampaign}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    );
}