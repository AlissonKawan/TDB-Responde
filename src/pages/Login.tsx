import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Section from '../components/layout/Section';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Field, Input } from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { useAuth } from '../context/useAuth';

interface FormData {
  usuario: string;
  senha: string;
}

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  if (user) {
    return <Navigate to={user.tipo === 'voluntario' ? '/admin' : '/portal'} replace />;
  }

  const onSubmit = (data: FormData) => {
    setErro('');
    setLoading(true);
    window.setTimeout(() => {
      const resultado = login(data.usuario, data.senha);
      setLoading(false);
      if (resultado === 'voluntario') navigate('/admin');
      else if (resultado === 'beneficiario') navigate('/portal');
      else setErro('Usuario ou senha invalidos. Tente novamente.');
    }, 600);
  };

  const preencher = (usuario: string, senha: string) => {
    setValue('usuario', usuario);
    setValue('senha', senha);
  };

  const voluntarios = [
    { usuario: 'ana.souza', senha: '123456', nome: 'Ana Souza', area: 'Odontologia', sigilo: true },
    { usuario: 'carlos.lima', senha: '123456', nome: 'Carlos Lima', area: 'Assistencia Social', sigilo: false },
    { usuario: 'beatriz.nunes', senha: '123456', nome: 'Beatriz Nunes', area: 'Psicologia', sigilo: true },
  ];

  const beneficiarios = [
    { usuario: 'CA-2024-001', senha: '1234', nome: 'Codigo CA-2024-001', desc: 'Crianca | 12 anos | EMEF Liberdade' },
    { usuario: 'CA-2024-002', senha: '1234', nome: 'Codigo CA-2024-002', desc: 'Crianca | 9 anos | EMEF Jardins' },
    { usuario: 'VIOLETA-07', senha: '1234', nome: 'VIOLETA-07', desc: 'Mulher Apolonia | Risco alto' },
    { usuario: 'ROSA-14', senha: '1234', nome: 'ROSA-14', desc: 'Mulher Apolonia | Risco medio' },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Acesso"
        title="Entrar no sistema"
        description="Acesse o painel de voluntarios ou o portal do beneficiario com suas credenciais."
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="p-6 lg:p-8">
            {erro && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {erro}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h2 className="text-2xl font-bold text-[#0F172A]">Credenciais</h2>
              <Field label="Usuario" error={errors.usuario?.message}>
                <Input
                  {...register('usuario', { required: 'Digite seu usuario' })}
                  placeholder="ana.souza ou CA-2024-001"
                  autoComplete="username"
                />
              </Field>
              <Field label="Senha" error={errors.senha?.message}>
                <Input
                  type="password"
                  {...register('senha', { required: 'Digite sua senha' })}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </Field>
              <Button type="submit" disabled={loading} size="large" fullWidth>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Card>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
            <Card className="p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2563EB]">Voluntarios</p>
              <div className="space-y-2">
                {voluntarios.map((item) => (
                  <button
                    key={item.usuario}
                    type="button"
                    onClick={() => preencher(item.usuario, item.senha)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#0F172A]">{item.nome}</span>
                      <span className="text-xs text-[#475569]">{item.area}{item.sigilo ? ' | Sigilo' : ''}</span>
                    </span>
                    <span className="text-xs font-bold text-[#2563EB]">usar</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2563EB]">Beneficiarios</p>
              <div className="space-y-2">
                {beneficiarios.map((item) => (
                  <button
                    key={item.usuario}
                    type="button"
                    onClick={() => preencher(item.usuario, item.senha)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span>
                      <span className="block text-sm font-bold text-[#0F172A]">{item.nome}</span>
                      <span className="text-xs text-[#475569]">{item.desc}</span>
                    </span>
                    <span className="text-xs font-bold text-[#2563EB]">usar</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

export default Login;

