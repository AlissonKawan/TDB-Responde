import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Button from '../ui/Button';
import Container from '../ui/Container';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isVoluntario } = useAuth();

  const linkClass = (path: string) =>
    `rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
      location.pathname === path
        ? 'bg-white text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0]'
        : 'text-[#475569] hover:bg-white hover:text-[#0F172A]'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[#E2E8F0]/80 bg-[#F8FAFC]/85 backdrop-blur-xl">
      <Container className="flex flex-wrap items-center justify-center gap-2 py-3">
        <Link to="/" className={linkClass('/')}>Home</Link>
        <Link to="/sobre" className={linkClass('/sobre')}>Sobre</Link>
        <Link to="/faq" className={linkClass('/faq')}>FAQ</Link>
        <Link to="/contato" className={linkClass('/contato')}>Contato</Link>
        <Link to="/integrantes" className={linkClass('/integrantes')}>Integrantes</Link>
        <Link to="/roadmap" className={linkClass('/roadmap')}>Solucao</Link>
        <Link to="/quero-ser-voluntario" className={linkClass('/quero-ser-voluntario')}>Seja voluntario</Link>

        <span className="mx-2 hidden h-6 w-px bg-slate-200 sm:block" />

        {!user && <Button href="/login" size="sm">Entrar</Button>}
        {user && isVoluntario && <Button href="/admin" size="sm">Sistema</Button>}
        {user && !isVoluntario && <Button href="/portal" size="sm">Portal</Button>}
        {user && (
          <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        )}
      </Container>
    </nav>
  );
}

export default NavBar;
