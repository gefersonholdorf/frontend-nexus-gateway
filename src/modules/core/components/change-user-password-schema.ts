import { z } from "zod";

/**
 * Schema de `change-user-password-modal.tsx` (RF013): nova senha + confirmação,
 * com validação de senhas coincidentes via `refine`.
 *
 * Isolado do componente para não misturar export de componente (Fast Refresh)
 * com export de constante no mesmo arquivo — mesmo padrão de
 * `user-form-schema.ts`.
 */
export const changeUserPasswordSchema = z
    .object({
        senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
        confirmarSenha: z.string().min(6, "Confirme a nova senha."),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: "As senhas não coincidem.",
        path: ["confirmarSenha"],
    });

export type ChangeUserPasswordValues = z.infer<typeof changeUserPasswordSchema>;
