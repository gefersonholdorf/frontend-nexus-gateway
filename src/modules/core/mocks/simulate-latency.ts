/**
 * Simula a latência de uma chamada de rede para os hooks mockados do Core.
 * Nenhuma etapa do módulo Core faz `fetch` real — ver docs/architecture/core-module-roadmap.md.
 */
export function simulateLatency(ms = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
