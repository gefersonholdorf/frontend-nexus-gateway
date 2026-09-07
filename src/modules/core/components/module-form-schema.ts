import { z } from "zod";

/**
 * Schema de `edit-module-modal.tsx` (RF022): apenas nome/descrição são
 * editáveis. Status é tratado à parte pelo toggle/`inactive-module-modal.tsx`
 * (RF022) — nunca pelo formulário de edição.
 */
export const moduleFormSchema = z.object({
    ds_name: z.string().trim().min(3, "Informe um nome válido."),
    ds_description: z.string().trim().min(3, "Informe uma descrição válida."),
});

export type ModuleFormValues = z.infer<typeof moduleFormSchema>;
