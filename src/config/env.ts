interface AppEnv {
  apiUrl: string;
}

function readRequired(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}. Verifique o arquivo .env do projeto.`,
    );
  }
  return value;
}

export const env: AppEnv = {
  apiUrl: readRequired("VITE_API_URL_V2", import.meta.env.VITE_API_URL_V2 as string | undefined),
};