import { createContext, useContext, useState, useEffect } from "react";
import { Clock3, LogIn } from "lucide-react";

export function LoginExpiredModal() {
  const { loginExpired, handleSetLoginExpired } = useLoginExpired();

  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!loginExpired) {
      setCountdown(15);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          clearInterval(interval);

          window.location.href = "/";

          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loginExpired]);

  if (!loginExpired) {
    return null;
  }

  function handleLogin() {
    handleSetLoginExpired(false);
    window.location.href = "/";
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-transparent/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-(image:--background-gradient) p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400">
            <Clock3 className="h-9 w-9 text-amber-400" />
          </div>

          <h2 className="text-2xl font-bold text-amber-500">
            Sessão expirada
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sua sessão expirou porque o token de autenticação não é mais válido.
            Faça login novamente para continuar acessando o sistema.
          </p>

          <p className="mt-5 text-sm text-blue-400">
            Você será redirecionado para o login em{" "}
            <strong>{countdown}</strong> segundos
          </p>

          <div className="mt-4 h-px w-full bg-white/10" />

          <button
            type="button"
            onClick={handleLogin}
            className="flex w-full text-[1rem] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            <LogIn className="size-4" />
            Fazer login agora
          </button>
        </div>
      </div>
    </div>
  );
}

type LoginExpiredContextData = {
    loginExpired: boolean
    handleSetLoginExpired: (loginExpired: boolean) => void;
};

const LoginExpiredContext = createContext<LoginExpiredContextData | undefined>(undefined);

type LoginExpiredProviderProps = {
    children: React.ReactNode;
};

export function LoginExpiredProvider({ children }: LoginExpiredProviderProps) {
    const [loginExpired, setLoginExpired] = useState(false);

    function handleSetLoginExpired(loginExpired: boolean) {
        setLoginExpired(loginExpired)
    }  

    return (
        <LoginExpiredContext.Provider value={{ loginExpired, handleSetLoginExpired }}>
            {children}
        </LoginExpiredContext.Provider>
    );
}

export function useLoginExpired() {
    const context = useContext(LoginExpiredContext);

    if (!context) {
        throw new Error("Erro ao usar Login Expired");
    }

    return context;
}