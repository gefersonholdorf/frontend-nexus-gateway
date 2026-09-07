import { z } from "zod";

/**
 * Schema de `integration-details-drawer.tsx` (RF026): nome, descrição e o
 * conteúdo de `ds_config` (RF027) são editáveis. `ds_secret` e `fl_active`/
 * `st_status` não passam por aqui — ver `inactive-integration-modal.tsx` e
 * `use-test-integration-connection.ts`.
 */
export const integrationFormSchema = z.object({
    ds_name: z.string().trim().min(3, "Informe um nome válido."),
    ds_description: z.string().trim().min(3, "Informe uma descrição válida."),
    ds_config: z.record(z.string(), z.string().trim().min(1, "Informe um valor.")),
});

export type IntegrationFormValues = z.infer<typeof integrationFormSchema>;
