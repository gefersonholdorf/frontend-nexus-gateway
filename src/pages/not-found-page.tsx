import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/welcome");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <main
      role="main"
      className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 py-16 text-foreground"
    >
      <section
        aria-labelledby="not-found-title"
        className="flex w-full max-w-md flex-col items-center text-center"
      >
        <div
          aria-hidden="true"
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted"
        >
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>

        <p className="text-sm font-semibold tracking-widest text-muted-foreground">
          ERRO 404
        </p>

        <h1
          id="not-found-title"
          className="mt-2 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          Página não encontrada
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A página que você procura não existe ou foi movida. Verifique o
          endereço ou volte para a página inicial do Nexus Gateway.
        </p>

        <div className="mt-8 flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Button>

          <Button className="w-full sm:w-auto" onClick={handleGoHome}>
            <Home className="h-4 w-4" aria-hidden="true" />
            Página Inicial
          </Button>
        </div>
      </section>
    </main>
  );
}
