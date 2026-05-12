import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Section from '../components/layout/Section';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Field, Input } from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { ApiError } from '../services/apiClient';
import type { LoginRequest } from '../types/auth';
import { useAuth } from '../context/useAuth';

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  if (user) {
    if (user.tipoUsuario === 'VOLUNTARIO') return <Navigate to="/portal/voluntario" replace />;
    if (user.tipoUsuario === 'BENEFICIARIO') return <Navigate to="/portal/beneficiario" replace />;
    return <Navigate to="/admin" replace />;
  }

  const errorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 404) return 'Conta nao encontrada.';
      if (error.status === 401) return 'Senha incorreta.';
      if (error.status === 0) return 'Nao foi possivel conectar ao servidor.';
      return error.message;
    }
    return 'Nao foi possivel entrar. Tente novamente.';
  };

  const onSubmit = async (data: LoginRequest) => {
    setErro('');
    setLoading(true);
    try {
      const loggedUser = await login(data);
      if (loggedUser.tipoUsuario === 'VOLUNTARIO') navigate('/portal/voluntario');
      else if (loggedUser.tipoUsuario === 'BENEFICIARIO') navigate('/portal/beneficiario');
      else navigate('/admin');
    } catch (error) {
      setErro(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Acesso"
        title="Entrar no sistema"
        description="Use seu e-mail e senha cadastrados no back-end para acessar seu portal."
      />

      <Section tone="white">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6 lg:p-8">
            {erro && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {erro}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h2 className="text-2xl font-bold text-[#0F172A]">Credenciais</h2>
              <Field label="E-mail" error={errors.email?.message}>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Digite seu e-mail',
                    pattern: { value: /^\S+@\S+$/i, message: 'E-mail invalido' },
                  })}
                  placeholder="voce@email.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Senha" error={errors.senha?.message}>
                <Input
                  type="password"
                  {...register('senha', {
                    required: 'Digite sua senha',
                    minLength: { value: 6, message: 'Senha minima de 6 caracteres' },
                  })}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </Field>
              <Button type="submit" disabled={loading} size="large" fullWidth>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Card>

          <Card className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-8 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Conta nova</p>
            <h2 className="mt-3 text-3xl font-black">Ainda nao tem acesso?</h2>
            <p className="mt-4 leading-7 text-blue-100">
              Cadastre sua conta de voluntario para entrar no portal e acompanhar atendimentos solicitados pela API.
            </p>
            <Button href="/quero-ser-voluntario" variant="secondary" size="large" className="mt-8">
              Criar conta de voluntario
            </Button>
          </Card>
        </div>
      </Section>
    </PageShell>
  );
}

export default Login;

