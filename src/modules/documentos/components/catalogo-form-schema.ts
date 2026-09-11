import { z } from "zod";

/**
 * Schema compartilhado por Categorias e Áreas (RF024) — mesmo shape
 * (`ds_nome`, `ds_sigla`, `fl_ativo`) nas duas telas de configuração.
 */
export const catalogoFormSchema = z.object({
    ds_nome: z.string().trim().min(2, "Informe um nome válido."),
    ds_sigla: z
        .string()
        .trim()
        .min(2, "Informe uma sigla válida.")
        .transform((value) => value.toUpperCase()),
    fl_ativo: z.boolean(),
});

export type CatalogoFormValues = z.infer<typeof catalogoFormSchema>;
