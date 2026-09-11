import { z } from "zod";

/**
 * Regex de código manual espelhando `validarFormatoCodigo()` do backend
 * (RN004): `SIGLA SIGLA NNN`. Validação client-side é só UX — o backend
 * ainda valida e pode recusar por duplicidade (Cenário 1, 400).
 */
const CODIGO_MANUAL_REGEX = /^[A-Z0-9]+ [A-Z0-9]+ \d{3,}$/;

/**
 * Schema de criação/edição de documento (RF001). `ds_codigo` só é exigido e
 * validado quando `st_modo_codigo === "MANUAL"` (RN004); em modo automático o
 * backend calcula o código (RN001-RN003).
 */
export const documentoFormSchema = z
    .object({
        ds_titulo: z.string().trim().min(3, "Informe um título válido."),
        ds_descricao: z.string().trim().min(3, "Informe uma descrição válida."),
        cd_categoria: z.number().int().positive("Selecione a categoria."),
        cd_area: z.number().int().positive("Selecione a área."),
        st_modo_codigo: z.enum(["AUTOMATICO", "MANUAL"]),
        ds_codigo: z.string().trim().optional(),
        cd_responsavel: z.number().int().positive("Selecione o responsável."),
        roles: z.array(z.number().int().positive()).min(1, "Selecione ao menos uma role."),
        cd_fluxo_aprovacao: z.number().int().positive().optional(),
    })
    .superRefine((values, ctx) => {
        if (values.st_modo_codigo === "MANUAL") {
            if (!values.ds_codigo || !CODIGO_MANUAL_REGEX.test(values.ds_codigo)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["ds_codigo"],
                    message:
                        "Código inválido ou já existente. Utilize o formato SIGLA SIGLA NNN e um valor único.",
                });
            }
        }
    });

export type DocumentoFormValues = z.infer<typeof documentoFormSchema>;
