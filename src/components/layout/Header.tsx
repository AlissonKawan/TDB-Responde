import { Link } from 'react-router-dom';
import Container from '../ui/Container';

function Header() {
  return (
    <header className="border-b border-[#E2E8F0]/80 bg-white/90 backdrop-blur-xl">
      <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/img/tdb-responde-logo.svg"
            alt="TDB Responde"
            className="h-16 w-auto lg:h-20"
          />
          <p className="hidden max-w-44 text-sm font-medium leading-5 text-[#475569] md:block">
            Atendimento social com inteligencia operacional
          </p>
        </Link>

        <a
          href="https://turmadobem.org.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#475569] shadow-sm transition hover:border-blue-200 hover:text-[#2563EB]"
        >
          <span>Em colaboracao com</span>
          <img src="/img/turmadobem.png" alt="Turma do Bem" className="h-10 w-auto lg:h-11" />
        </a>
      </Container>
    </header>
  );
}

export default Header;
