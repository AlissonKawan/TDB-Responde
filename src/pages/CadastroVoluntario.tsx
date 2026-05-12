import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Section from '../components/layout/Section';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Field, Input, Select } from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import SectionHeader from '../components/ui/SectionHeader';
import { ApiError } from '../services/apiClient';
import type { TipoUsuario } from '../types/auth';
import { useAuth } from '../context/useAuth';

interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipoUsuario: TipoUsuario;
}

function CadastroVoluntario() {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { tipoUsuario: 'VOLUNTARIO' },
  });

  const senha = watch('senha');

  const errorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 409) return 'Este e-mail ja esta cadastrado.';
      if (error.status === 400) return error.message || 'Confira os dados do cadastro.';
      if (error.status === 0) return 'Nao foi possivel conectar ao servidor.';
      return error.message;
    }
    return 'Nao foi possivel criar o cadastro.';
  };

  const onSubmit = async (data: FormData) => {
    setErro('');
    setSucesso('');
    setLoading(true);
    try {
      await registerAccount({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        tipoUsuario: data.tipoUsuario,
      });
      setSucesso('Cadastro criado com sucesso. Agora voce pode entrar usando seu e-mail e senha.');
      window.setTimeout(() => navigate('/login'), 1800);
    } catch (error) {
      setErro(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Cadastro"
        title="Crie sua conta de voluntario"
        description="O cadastro chama o back-end em /auth/register e nao salva senha no front-end."
      />

      <Section tone="white">
        <SectionHeader
          eyebrow="Voluntariado"
          title="Uma conta para acessar atendimentos reais"
          description="Depois do cadastro, use o login para entrar no portal do voluntario e acompanhar atendimentos solicitados."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Conta segura', 'Senha enviada apenas para o back-end no cadastro e login.'],
            ['Portal dedicado', 'Voluntarios visualizam solicitados e seus atendimentos.'],
            ['API real', 'Sem banco fake no front quando existe endpoint disponivel.'],
          ].map(([title, desc]) => (
            <Card key={title} className="p-6">
              <h3 className="font-bold text-[#0F172A]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="blue">
        <Card className="mx-auto max-w-3xl p-6 lg:p-8">
          {sucesso && (
            <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-[#059669]">
              {sucesso}
            </div>
          )}
          {erro && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {erro}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Nome completo" error={errors.nome?.message}>
              <Input {...register('nome', { required: 'Nome obrigatorio' })} placeholder="Maria da Silva" />
            </Field>
            <Field label="E-mail" error={errors.email?.message}>
              <Input
                type="email"
                {...register('email', {
                  required: 'E-mail obrigatorio',
                  pattern: { value: /^\S+@\S+$/i, message: 'E-mail invalido' },
                })}
                placeholder="seu@email.com"
              />
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Senha" error={errors.senha?.message}>
                <Input
                  type="password"
                  {...register('senha', {
                    required: 'Senha obrigatoria',
                    minLength: { value: 6, message: 'Senha minima de 6 caracteres' },
                  })}
                  placeholder="Minimo 6 caracteres"
                />
              </Field>
              <Field label="Confirmar senha" error={errors.confirmarSenha?.message}>
                <Input
                  type="password"
                  {...register('confirmarSenha', {
                    required: 'Confirme sua senha',
                    validate: (value) => value === senha || 'As senhas precisam ser iguais',
                  })}
                  placeholder="Repita sua senha"
                />
              </Field>
            </div>
            <Field label="Tipo de usuario" error={errors.tipoUsuario?.message}>
              <Select {...register('tipoUsuario', { required: 'Tipo de usuario obrigatorio' })}>
                <option value="VOLUNTARIO">Voluntario</option>
                <option value="BENEFICIARIO">Beneficiario</option>
              </Select>
            </Field>
            <Button type="submit" disabled={loading} size="large" fullWidth>
              {loading ? 'Criando cadastro...' : 'Criar cadastro'}
            </Button>
          </form>
        </Card>
      </Section>
    </PageShell>
  );
}

export default CadastroVoluntario;

