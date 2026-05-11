import type { Paciente, TipoPaciente } from './Paciente';

export type StatusAtendimentoApi = 'Aberto' | 'Em andamento' | 'Aguardando' | 'Encerrado';
export type PrioridadeAtendimento = 1 | 2 | 3;

export interface MensagemAtendimento {
  de: 'voluntario' | 'pessoa';
  texto: string;
  hora: string;
}

export interface HistoricoAtendimento {
  statusAnterior: string;
  statusNovo: string;
  alteradoPor: string;
  dataHora: string;
}

export interface Atendimento {
  id: number;
  tipo: TipoPaciente;
  pessoa: Paciente;
  canal: string;
  prioridade: PrioridadeAtendimento;
  status: StatusAtendimentoApi;
  voluntarioId: number | null;
  dataAbertura: string;
  mensagens: MensagemAtendimento[];
  historico: HistoricoAtendimento[];
}

