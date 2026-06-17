/**
 * Mapeamento de cada tipo de resultado da pesquisa global para a rota de
 * destino. Como ainda não há páginas de detalhe, navegamos para a listagem.
 */
export type GlobalSearchEntity = 'cliente' | 'fornecedor' | 'lancamento'

export const GLOBAL_SEARCH_ROUTES: Record<GlobalSearchEntity, string> = {
  cliente: '/costumers',
  fornecedor: '/suppliers',
  lancamento: '/transactions',
}
