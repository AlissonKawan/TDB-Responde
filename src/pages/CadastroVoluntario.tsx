import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Section from '../components/layout/Section';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Field, Input, Select, Textarea } from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import SectionHeader from '../components/ui/SectionHeader';
import { loadTDBState, saveTDBState } from '../context/tdbStorage';
import type { SolicitacaoVoluntario } from '../types';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  motivacao: string;
  disponibilidade: string;
}

function gerarId(solicitacoes: SolicitacaoVoluntario[]): number {
  if (solicitacoes.length === 0) return 1;
  return Math.max(...solicitacoes.map((s) => s.id)) + 1;
}

function dataHoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function CadastroVoluntario() {
  const navigate = useNavigate();
  const [enviado, setEnviado] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const state = loadTDBState();
    const solicitacoes = state.solicitacoesVoluntario ?? [];
    const nova: SolicitacaoVoluntario = {
      id: gerarId(solicitacoes),
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      especialidade: data.especialidade,
      motivacao: data.motivacao,
      disponibilidade: data.disponibilidade,
      status: 'pendente',
      dataSolicitacao: dataHoje(),
    };
    saveTDBState({ ...state, solicitacoesVoluntario: [...solicitacoes, nova] });
    setEnviado(true);
  };

  if (enviado) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Inscricao enviada"
          title="Recebemos sua solicitacao"
          description="Sua inscricao foi registrada e sera analisada pela equipe."
          align="center"
        />
        <Section tone="white">
          <Card className="mx-auto max-w-2xl p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-black text-[#059669] ring-1 ring-emerald-100">
              OK
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Obrigado pelo interesse em ajudar</h2>
            <p className="mt-3 text-[#475569]">
              Entraremos em contato em breve pelo e-mail informado.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={() => navigate('/')} size="large">Voltar ao inicio</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/sobre')} size="large">Conhecer projeto</Button>
            </div>
          </Card>
        </Section>
      </PageShell>
    );
  }

  const areas = ['Odontologia', 'Assistencia Social', 'Psicologia', 'Direito', 'Educacao', 'Tecnologia', 'Geral'];
  const disponibilidades = ['Manhas', 'Tardes', 'Noites', 'Fins de semana', 'Flexivel'];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Voluntariado"
        title="Seja voluntario"
        description="Registre seu interesse para fazer parte da rede de apoio da Turma do Bem."
      />

      <Section tone="white">
        <SectionHeader
          eyebrow="Areas"
          title="Onde sua ajuda pode atuar"
          description="O projeto conecta diferentes especialidades a demandas sociais reais."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Odontologia', 'Atendimento bucal gratuito para criancas e adolescentes.'],
            ['Assistencia Social', 'Apoio, acolhimento e orientacao para familias atendidas.'],
            ['Psicologia', 'Suporte emocional e saude mental para beneficiarios.'],
            ['Direito', 'Orientacao juridica e defesa de direitos.'],
          ].map(([title, desc], index) => (
            <Card key={title} className="p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 font-bold text-[#2563EB] ring-1 ring-blue-100">
                {index + 1}
              </span>
              <h3 className="font-bold text-[#0F172A]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="blue">
        <Card className="mx-auto max-w-3xl p-6 lg:p-8">
          <SectionHeader title="Preencha sua inscricao" description="Campos obrigatorios ajudam a equipe a avaliar o melhor caminho para contato." />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Nome completo" error={errors.nome?.message}>
              <Input {...register('nome', { required: 'Digite seu nome completo' })} placeholder="Maria da Silva" />
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="E-mail" error={errors.email?.message}>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Digite um e-mail valido',
                    pattern: { value: /^\S+@\S+$/i, message: 'E-mail invalido' },
                  })}
                  placeholder="seu@email.com"
                />
              </Field>
              <Field label="Telefone" error={errors.telefone?.message}>
                <Input {...register('telefone', { required: 'Digite seu telefone' })} placeholder="(11) 9 0000-0000" />
              </Field>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Area de atuacao" error={errors.especialidade?.message}>
                <Select {...register('especialidade', { required: 'Selecione uma area' })}>
                  <option value="">Selecione...</option>
                  {areas.map((area) => <option key={area} value={area}>{area}</option>)}
                </Select>
              </Field>
              <Field label="Disponibilidade" error={errors.disponibilidade?.message}>
                <Select {...register('disponibilidade', { required: 'Selecione sua disponibilidade' })}>
                  <option value="">Selecione...</option>
                  {disponibilidades.map((item) => <option key={item} value={item}>{item}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Por que quer ser voluntario?" error={errors.motivacao?.message}>
              <Textarea
                rows={5}
                {...register('motivacao', {
                  required: 'Conte sua motivacao',
                  minLength: { value: 20, message: 'Minimo 20 caracteres' },
                })}
                placeholder="Conte um pouco sobre sua motivacao..."
              />
            </Field>
            <Button type="submit" size="large" fullWidth>Enviar inscricao</Button>
            <p className="text-center text-sm text-[#475569]">
              Ja e voluntario?{' '}
              <button type="button" onClick={() => navigate('/login')} className="font-semibold text-[#2563EB] hover:text-[#1E3A8A]">
                Acesse o sistema
              </button>
            </p>
          </form>
        </Card>
      </Section>
    </PageShell>
  );
}

export default CadastroVoluntario;

