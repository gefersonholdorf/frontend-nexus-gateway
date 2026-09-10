import { z } from "zod";

/**
 * Schema compartilhado por `create-hub-service-modal.tsx` e
 * `edit-hub-service-modal.tsx`.
 *
 * RN002: título/descrição/tipo/ambiente obrigatórios.
 * RN003: tipo e ambiente em opções controladas.
 * RN005: URLs de acesso e status, quando informadas, precisam ser http/https.
 * IP e Porta são dois campos independentes e opcionais (decisão de negócio:
 * a interdependência que existia aqui foi removida deliberadamente — não
 * reintroduzir sem confirmar com o usuário).
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

/** Métodos HTTP suportados pelo teste de status (RF005/RF007). */
export const STATUS_CHECK_METHODS = ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"] as const;

/** Métodos que aceitam corpo de requisição (RF007/RF008/RN007). */
const METHODS_WITH_BODY = ["POST", "PUT", "PATCH"] as const;

/** Tipos de autenticação suportados pelo teste de status. */
export const STATUS_CHECK_AUTH_TYPES = ["NONE", "BEARER", "API_KEY_HEADER", "BASIC"] as const;

const statusCheckMethodEnum = z.enum(STATUS_CHECK_METHODS);
const statusCheckAuthTypeEnum = z.enum(STATUS_CHECK_AUTH_TYPES);

const statusCheckHeaderSchema = z.object({
    key: z.string().trim().min(1, "Informe a chave do header."),
    value: z.string().trim(),
});

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

        // Teste de status (RF005-RF008) — método/headers/autenticação/body.
        st_status_check_method: statusCheckMethodEnum.default("GET"),
        ds_status_check_headers: z.array(statusCheckHeaderSchema).default([]),

        // Autenticação: mantida como campos escalares/planos no formulário
        // (mais simples para react-hook-form do que uma união discriminada
        // em si) e remontada como `status_check_auth` no `.transform` final,
        // no mesmo formato de entrada esperado pelo backend.
        st_status_check_auth_type: statusCheckAuthTypeEnum.default("NONE"),
        status_check_auth_token: z.string().trim().default(""),
        status_check_auth_header_name: z.string().trim().default(""),
        status_check_auth_header_value: z.string().trim().default(""),
        status_check_auth_username: z.string().trim().default(""),
        status_check_auth_password: z.string().trim().default(""),

        ds_status_check_body: nullableText,
    })
    .superRefine((data, ctx) => {
        if (data.st_status_check_auth_type === "BEARER" && !data.status_check_auth_token) {
            ctx.addIssue({
                code: "custom",
                path: ["status_check_auth_token"],
                message: "Informe o token.",
            });
        }

        if (data.st_status_check_auth_type === "API_KEY_HEADER") {
            if (!data.status_check_auth_header_name) {
                ctx.addIssue({
                    code: "custom",
                    path: ["status_check_auth_header_name"],
                    message: "Informe o nome do header.",
                });
            }
            if (!data.status_check_auth_header_value) {
                ctx.addIssue({
                    code: "custom",
                    path: ["status_check_auth_header_value"],
                    message: "Informe o valor do header.",
                });
            }
        }

        if (data.st_status_check_auth_type === "BASIC") {
            if (!data.status_check_auth_username) {
                ctx.addIssue({
                    code: "custom",
                    path: ["status_check_auth_username"],
                    message: "Informe o usuário.",
                });
            }
            if (!data.status_check_auth_password) {
                ctx.addIssue({
                    code: "custom",
                    path: ["status_check_auth_password"],
                    message: "Informe a senha.",
                });
            }
        }

        // RF007/RF008/RN007: body só é válido quando o método aceita corpo.
        if (
            data.ds_status_check_body != null &&
            !(METHODS_WITH_BODY as readonly string[]).includes(data.st_status_check_method)
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["ds_status_check_body"],
                message: "Corpo só é permitido para os métodos POST, PUT ou PATCH.",
            });
        }
    })
    .transform((data) => {
        const status_check_auth =
            data.st_status_check_auth_type === "BEARER"
                ? ({ type: "BEARER", token: data.status_check_auth_token } as const)
                : data.st_status_check_auth_type === "API_KEY_HEADER"
                  ? ({
                        type: "API_KEY_HEADER",
                        headerName: data.status_check_auth_header_name,
                        value: data.status_check_auth_header_value,
                    } as const)
                  : data.st_status_check_auth_type === "BASIC"
                    ? ({
                          type: "BASIC",
                          username: data.status_check_auth_username,
                          password: data.status_check_auth_password,
                      } as const)
                    : ({ type: "NONE" } as const);

        return {
            st_type: data.st_type,
            st_environment: data.st_environment,
            ds_title: data.ds_title,
            ds_description: data.ds_description,
            ds_access_url: data.ds_access_url,
            ds_ip: data.ds_ip,
            ds_port: data.ds_port,
            ds_status_url: data.ds_status_url,
            st_status_check_method: data.st_status_check_method,
            ds_status_check_headers:
                data.ds_status_check_headers.length === 0 ? null : data.ds_status_check_headers,
            status_check_auth,
            ds_status_check_body: data.ds_status_check_body,
        };
    });

/** Formato bruto dos campos, como preenchidos no formulário (antes do parse). */
export type HubServiceFormInput = z.input<typeof hubServiceFormSchema>;

/** Formato após validação/transform do zod — o que chega em `onSubmit`. */
export type HubServiceFormValues = z.infer<typeof hubServiceFormSchema>;
