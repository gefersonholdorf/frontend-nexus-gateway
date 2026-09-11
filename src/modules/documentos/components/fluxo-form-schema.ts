import { z } from "zod";

/**
 * Etapa do builder de fluxo (RF015/RN015). `ds_ordem` não é editável pelo
 * usuário — é derivado da posição da etapa na lista no momento do submit,
 * garantindo sequência sem lacunas/duplicatas.
 */
export const fluxoEtapaFormSchema = z.object({
    ds_nome: z.string().trim().min(1, "Informe o nome da etapa."),
    aprovadores: z.array(z.number().int().positive()).min(1, "Selecione ao menos um aprovador."),
});

export const fluxoFormSchema = z.object({
    ds_nome: z.string().trim().min(2, "Informe um nome válido."),
    ds_descricao: z.string().trim().optional(),
    etapas: z.array(fluxoEtapaFormSchema).min(1, "Adicione ao menos uma etapa."),
});

export type FluxoFormValues = z.infer<typeof fluxoFormSchema>;
