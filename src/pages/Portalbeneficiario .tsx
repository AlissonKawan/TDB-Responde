import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../components/layout/Section';
import PageShell from '../components/layout/PageShell';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/ui/Container';
import { Input } from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import SectionHeader from '../components/ui/SectionHeader';
import { useAuth } from '../context/useAuth';
import { loadTDBState, saveTDBState } from '../context/tdbStorage';
import type { Atendimento, CriancaAdolescente, MulherApolonia } from '../types';

function nomePessoa(a: Atendimento) {
  return a.tipo === 'crianca'
    ? (a.pessoa as CriancaAdolescente).nomeCodificado
    : (a.pessoa as MulherApolonia).codinome;
}

function statusTone(status: string) {
  if (status === 'Encerrado') return 'success';
  if (status === 'Aberto') return 'info';
  if (status === 'Em andamento') return 'warning';
  return 'neutral';
}

function PortalBeneficiario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadTDBState());
  const [chatInput, setChatInput] = useState('');
  const [atendAberto, setAtendAberto] = useState<Atendimento | null>(null);

  const meuNome = user?.nome?.toUpperCase() ?? '';
  const meusAtendimentos = state.atendimentos.filter((a) => {
    const nome = nomePessoa(a).toUpperCase();
    return nome === meuNome || nome.includes(meuNome) || meuNome.includes(nome);
  });
  const ativos = meusAtendimentos.filter((a) => a.status !== 'Encerrado');
  const encerrados = meusAtendimentos.filter((a) => a.status === 'Encerrado');

  const sendMsg = () => {
    if (!chatInput.trim() || !atendAberto) return;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const updatedAtend = {
      ...atendAberto,
      mensagens: [...atendAberto.mensagens, { de: 'pessoa' as const, texto: chatInput.trim(), hora }],
    };
    const newState = {
      ...state,
      atendimentos: state.atendimentos.map((a) => a.id === atendAberto.id ? updatedAtend : a),
    };
    setState(newState);
    saveTDBState(newState);
    setAtendAberto(updatedAtend);
    setChatInput('');
  };

  return (
    <PageShell>
      <header className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
        <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button onClick={() => navigate('/')} className="text-sm font-semibold text-[#2563EB] hover:text-[#1E3A8A]">
              Voltar para o site
            </button>
            <p className="mt-1 text-sm text-[#475569]">Portal do beneficiario | {user?.nome}</p>
          </div>
          <Button variant="secondary" onClick={() => { logout(); navigate('/login'); }}>Sair</Button>
        </Container>
      </header>

      <PageHeader
        eyebrow="Portal"
        title={`Ola, ${user?.nome ?? 'beneficiario'}`}
        description="Acompanhe seus atendimentos, status e mensagens com a equipe de voluntarios."
      />

      <Section tone="white">
        <SectionHeader title="Seus atendimentos" description="Protocolos ativos aparecem primeiro para facilitar o acompanhamento." />
        {ativos.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-lg font-bold text-[#0F172A]">Nenhum atendimento ativo no momento.</p>
            <p className="mt-2 text-[#475569]">Seu codigo de acesso e {user?.nome}. Ele deve corresponder ao codigo do atendimento.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {ativos.map((a) => {
              const vol = a.voluntarioId ? state.voluntarios.find((v) => v.id === a.voluntarioId) : null;
              const ultimaMsg = a.mensagens[a.mensagens.length - 1];
              return (
                <Card
                  key={a.id}
                  onClick={() => setAtendAberto(a)}
                  className="cursor-pointer p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-[#0F172A]">#{a.id} {nomePessoa(a)}</h3>
                        <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                        {a.prioridade === 3 && <Badge tone="danger">Urgente</Badge>}
                      </div>
                      <p className="mt-2 text-sm text-[#475569]">Canal: {a.canal} | Aberto em {a.dataAbertura}</p>
                      {ultimaMsg && <p className="mt-2 truncate text-sm text-slate-400">{ultimaMsg.de === 'voluntario' ? `${vol?.nome ?? 'Voluntario'}: ` : 'Voce: '}{ultimaMsg.texto}</p>}
                    </div>
                    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#475569]">
                      {vol ? <strong className="text-[#0F172A]">{vol.nome}</strong> : 'Aguardando voluntario'}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      {encerrados.length > 0 && (
        <Section tone="blue">
          <SectionHeader title="Atendimentos encerrados" />
          <div className="grid gap-3">
            {encerrados.map((a) => (
              <Card key={a.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold text-[#0F172A]">{nomePessoa(a)}</p>
                  <p className="text-sm text-[#475569]">Aberto em {a.dataAbertura} | Canal: {a.canal}</p>
                </div>
                <Badge tone="success">Encerrado</Badge>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section tone="white">
        <Card className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Precisa de mais ajuda?</h2>
            <p className="mt-2 text-[#475569]">Nossa equipe esta disponivel para atendimento direto.</p>
          </div>
          <Button onClick={() => navigate('/contato')} size="large">Fale com a equipe</Button>
        </Card>
      </Section>

      {atendAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <Card className="w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5">
              <div>
                <h3 className="font-bold text-[#0F172A]">Atendimento #{atendAberto.id}</h3>
                <Badge tone={statusTone(atendAberto.status)}>{atendAberto.status}</Badge>
              </div>
              <button onClick={() => setAtendAberto(null)} className="text-2xl leading-none text-[#475569] hover:text-[#0F172A]">&times;</button>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex h-64 flex-col gap-2 overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                {atendAberto.mensagens.map((m, i) => (
                  <div key={i} className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${m.de === 'voluntario' ? 'self-end bg-[#2563EB] text-white' : 'self-start border border-[#E2E8F0] bg-white text-[#0F172A]'}`}>
                    {m.texto}
                    <div className={`mt-1 text-[10px] ${m.de === 'voluntario' ? 'text-blue-100' : 'text-slate-400'}`}>{m.hora}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMsg()} placeholder="Escreva sua mensagem..." />
                <Button onClick={sendMsg}>Enviar</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageShell>
  );
}

export default PortalBeneficiario;

