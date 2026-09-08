import { z } from "zod";

import { userFormSchema } from "./user-form-schema";

/**
 * Estende `userFormSchema` só para a criação de usuário (RF011), que exige
 * senha — diferente da edição, onde a senha é trocada em fluxo separado
 * (`change-user-password-modal.tsx`).
 */
export const createUserFormSchema = userFormSchema.extend({
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
