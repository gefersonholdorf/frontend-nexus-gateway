import { z } from "zod";

/**
 * Schema compartilhado por `create-hub-service-modal.tsx` e
 * `edit-hub-service-modal.tsx`.
 *
 * RN002: título/descrição/tipo/ambiente obrigatórios.
 * RN003: tipo e ambiente em opções controladas.
 * RN004: IP e Porta são interdependentes — validado via `superRefine`.
 * RN005: URLs de acesso e status, quando informadas, precisam ser http/https.
 *
 * Isolado de `hub-service-form-fields.tsx` para não misturar export de
 * componente (Fast Refresh) com export de constante no mesmo arquivo.
 */
// Os três campos abaixo vêm sempre de um <Input> (string, nunca null no DOM);
// o `.nullable()` só existe no lado de saída, via `transform`, para enviar
// `null` ao backend em vez de string vazia quando o campo opcional está em branco.
const nullableHttpUrl = z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .refine(
        (value) => value === null || z.url({ protocol: /^https?$/ }).safeParse(value).success,
        { message: "Informe uma URL http/https válida." },
    );

const nullableText = z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value));

const nullablePort = z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .refine(
        (value) => value === null || (Number.isInteger(value) && value > 0 && value <= 65535),
        { message: "Informe uma porta válida (1-65535)." },
    );

export const hubServiceFormSchema = z
    .object({
        st_type: z.enum(["SYSTEM", "SERVICE"], { message: "Selecione o tipo." }),
        st_environment: z.enum(["PROD", "HOM"], { message: "Selecione o ambiente." }),
        ds_title: z.string().trim().min(1, "Informe o título."),
        ds_description: z.string().trim().min(1, "Informe a descrição."),
        ds_access_url: nullableHttpUrl,
        ds_ip: nullableText,
        ds_port: nullablePort,
        ds_status_url: nullableHttpUrl,
    })
    .superRefine((data, ctx) => {
        if (data.ds_ip && data.ds_port == null) {
            ctx.addIssue({
                code: "custom",
                path: ["ds_port"],
                message: "Porta é obrigatória quando o IP é informado.",
            });
        }

        if (data.ds_port != null && !data.ds_ip) {
            ctx.addIssue({
                code: "custom",
                path: ["ds_ip"],
                message: "IP é obrigatório quando a porta é informada.",
            });
        }
    });

/** Formato bruto dos campos, como preenchidos no formulário (antes do parse). */
export type HubServiceFormInput = z.input<typeof hubServiceFormSchema>;

/** Formato após validação/transform do zod — o que chega em `onSubmit`. */
export type HubServiceFormValues = z.infer<typeof hubServiceFormSchema>;
