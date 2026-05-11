// src/context/AuthContext.tsx
// Exporta APENAS o AuthProvider (componente).
// AuthContext fica em authContextInstance.ts
// useAuth fica em useAuth.ts

import { useState, useEffect, type ReactNode } from 'react';
import type { AuthUser } from '../types/index';
import { AuthContext } from './authContextInstance';
import { loadTDBState } from './tdbStorage';

const TEST_VOLUNTEERS = [
  { id: 1, nome: 'Ana Souza', usuario: 'ana.souza', senha: '123456', especialidade: 'Odontologia', acessoSigilo: true },
  { id: 2, nome: 'Carlos Lima', usuario: 'carlos.lima', senha: '123456', especialidade: 'Assistencia Social', acessoSigilo: false },
  { id: 3, nome: 'Beatriz Nunes', usuario: 'beatriz.nunes', senha: '123456', especialidade: 'Psicologia', acessoSigilo: true },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('tdb_auth_user');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('tdb_auth_user', JSON.stringify(user));
    else localStorage.removeItem('tdb_auth_user');
  }, [user]);

  const login = (usuario: string, senha: string): 'voluntario' | 'beneficiario' | 'erro' => {
    if (!usuario.trim() || !senha.trim()) return 'erro';

    const state = loadTDBState();

    const voluntario = state.voluntarios.find(
      v => v.usuario === usuario.trim() && v.senha === senha.trim()
    );

    if (voluntario) {
      setUser({
        id: voluntario.id,
        nome: voluntario.nome,
        tipo: 'voluntario',
        acessoSigilo: voluntario.acessoSigilo,
        especialidade: voluntario.especialidade,
      });
      return 'voluntario';
    }

    const voluntarioTeste = TEST_VOLUNTEERS.find(
      v => v.usuario === usuario.trim() && v.senha === senha.trim()
    );

    if (voluntarioTeste) {
      setUser({
        id: voluntarioTeste.id,
        nome: voluntarioTeste.nome,
        tipo: 'voluntario',
        acessoSigilo: voluntarioTeste.acessoSigilo,
        especialidade: voluntarioTeste.especialidade,
      });
      return 'voluntario';
    }

    if (usuario.trim().length >= 3 && senha.trim().length >= 4) {
      setUser({
        id: 0,
        nome: usuario.trim(),
        tipo: 'beneficiario',
      });
      return 'beneficiario';
    }

    return 'erro';
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isVoluntario: user?.tipo === 'voluntario' }}>
      {children}
    </AuthContext.Provider>
  );
}
