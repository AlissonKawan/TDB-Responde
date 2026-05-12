export type AtendimentoStatus =
  | 'SOLICITADO'
  | 'EM_ANDAMENTO'
  | 'FINALIZADO'
  | 'CANCELADO'
  | 'Aberto'
  | 'Em andamento'
  | 'Aguardando'
  | 'Encerrado';

export type AtendimentoPrioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 1 | 2 | 3;

export interface AtendimentoUsuarioResumo {
  id?: number;
  nome?: string;
  email?: string;
}

export interface AtendimentoApi {
  id: number;
  titulo?: string;
  descricao?: string;
  observacao?: string;
  status?: AtendimentoStatus;
  prioridade?: AtendimentoPrioridade;
  canal?: string;
  dataCriacao?: string;
  dataAbertura?: string;
  dataAtualizacao?: string;
  dataEncerramento?: string;
  solicitanteNome?: string;
  beneficiarioNome?: string;
  pacienteNome?: string;
  pacienteId?: number;
  beneficiarioId?: number;
  voluntarioId?: number | null;
  voluntario?: AtendimentoUsuarioResumo | null;
  beneficiario?: AtendimentoUsuarioResumo | null;
  usuario?: AtendimentoUsuarioResumo | null;
}

