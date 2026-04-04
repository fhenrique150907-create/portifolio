import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

type Project = {
  id: number;
  title: string;
  description: string;
  stack: string;
  demo_link: string | null;
  github_link: string | null;
};

type Profile = {
  name: string;
  role: string;
  bio: string;
  instagram: string;
  whatsapp: string;
  email?: string;
  phone?: string;
  location?: string;
  projects: Project[];
};

const fallbackProfile: Profile = {
  name: "Flavio Henrique",
  role: "Desenvolvedor web",
  bio: "Construo sites e APIs para ajudar negócios a crescerem no digital.",
  instagram: "https://instagram.com/seuusuario",
  whatsapp: "https://wa.me/5500000000000",
  email:  "fhenrique150907@gmail.com",
  phone: "",
  location: "",
  projects: [],
};

const DEFAULT_SKILLS = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Git",
];

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function logoSlug(fullName: string): string {
  const raw = firstName(fullName)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  return raw ? `${raw}.dev` : "portfolio.dev";
}

function carouselIconUrl(skill: string): string | null {
  const k = skill.trim().toLowerCase();
  const map: Record<string, string> = {
    html5: "html5/html5-original",
    html: "html5/html5-original",
    css3: "css3/css3-original",
    css: "css3/css3-original",
    javascript: "javascript/javascript-original",
    js: "javascript/javascript-original",
    react: "react/react-original",
    typescript: "typescript/typescript-original",
    ts: "typescript/typescript-original",
    "node.js": "nodejs/nodejs-original",
    nodejs: "nodejs/nodejs-original",
    postgresql: "postgresql/postgresql-original",
    git: "git/git-original",
    php: "php/php-original",
    python: "python/python-original",
    csharp: "csharp/csharp-original",
    "c#": "csharp/csharp-original",
  };
  const path = map[k];
  if (!path) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`;
}

function App() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    stack: "",
    demo_link: "",
    github_link: "",
  });

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("http://localhost:4000/api/profile");
        if (!response.ok) throw new Error("api");
        setProfile((await response.json()) as Profile);
      } catch {
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const skillTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of profile.projects) {
      for (const part of p.stack.split(/[,;]+/)) {
        const t = part.trim();
        if (t) set.add(t);
      }
    }
    const list = Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
    return list.length ? list : DEFAULT_SKILLS;
  }, [profile.projects]);

  const carouselItems = useMemo(() => {
    const base = [...skillTags];
    return [...base, ...base, ...base, ...base];
  }, [skillTags]);

  const roleCh = Math.max(profile.role.length + 2, 12);
  const roleSteps = Math.min(Math.max(profile.role.length + 6, 16), 48);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=320&background=28,74,212&color=fff&bold=true`;

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("http://localhost:4000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("create");
      const created = (await response.json()) as Project;
      setProfile((prev) => ({ ...prev, projects: [...prev.projects, created] }));
      setForm({
        title: "",
        description: "",
        stack: "",
        demo_link: "",
        github_link: "",
      });
    } catch {
      alert("Não foi possível criar o projeto agora.");
    } finally {
      setSaving(false);
    }
  }

  function handleContactSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const subject = encodeURIComponent("Contato pelo portfólio");
    const body = encodeURIComponent(
      `${fd.get("nome") ?? ""}\n${fd.get("email") ?? ""}\n\n${fd.get("mensagem") ?? ""}`
    );
    window.location.href = `mailto:${profile.email ?? ""}?subject=${subject}&body=${body}`;
  }

  return (
    <div className={`page ${pageLoaded ? "page-enter" : ""}`}>
      <div className="cursor-light" ref={cursorRef} aria-hidden />

      <div className="Topo">
        <header>
          <h1>{logoSlug(profile.name)}</h1>

          <button
            type="button"
            className={`hamburger ${menuOpen ? "active" : ""}`}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav aria-label="Principal">
            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
              <li>
                <a href="#inicio" onClick={closeMenu}>
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" onClick={closeMenu}>
                  Sobre
                </a>
              </li>
              <li>
                <a href="#projeto" onClick={closeMenu}>
                  Projetos
                </a>
              </li>
              <li>
                <a href="#contato" onClick={closeMenu}>
                  Contato
                </a>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      <section className="Banner" id="inicio">
        <div className="textos">
          <h1>
            Olá! Me chamo {firstName(profile.name)} 👋
          </h1>
          <span
            className="msg"
            style={
              {
                ["--msg-w" as string]: `${roleCh}ch`,
                animation: `mark 0.8s step-end infinite, writeDynamic 7s steps(${roleSteps}, end) infinite`,
              } as React.CSSProperties
            }
          >
            {profile.role}
          </span>
          <h3>{profile.bio}</h3>
          <a
            className="banner-cta"
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Entre em contato
          </a>
        </div>
        <img src={avatarUrl} alt="" width={320} height={320} />
      </section>

      <div className="carrosa">
        <div className="carousel-container">
          <div className="carousel-track" aria-hidden>
            {carouselItems.map((skill, idx) => {
              const src = carouselIconUrl(skill);
              return (
                <div className="carousel-item" key={`${skill}-${idx}`}>
                  {src ? (
                    <img src={src} alt="" width={40} height={40} loading="lazy" />
                  ) : (
                    <span className="carousel-fallback" title={skill}>
                      {skill.slice(0, 3)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section id="sobre" className="Sobre">
        <h2 className="sobre-titulo">Sobre Mim</h2>
        <div className="sobre-container">
          <h3>{profile.bio}</h3>
        </div>

        <div className="tecnologias">
          <h1>Skill &amp; Tecnologias</h1>
          <div className="tec">
            {skillTags.map((tag) => (
              <h2 key={tag}>{tag}</h2>
            ))}
          </div>
        </div>

        <div className="brinc">
          <h3>
            const desenvolvedor = {`{`}
          </h3>
          <p>{` name: '${profile.name.replace(/'/g, "\\'")}'`}</p>
          <p>{` função: '${profile.role.replace(/'/g, "\\'")}'`}</p>
          <p>{` paixão: 'Criar experiências web incríveis'`}</p>
          <h3>{`};`}</h3>
        </div>
      </section>

      <section id="projeto" className="secao-projetos">
        <h2 className="titulo-projetos">Meus Projetos</h2>
        {loading ? (
          <p className="loading-projetos">Carregando projetos…</p>
        ) : (
          <div className="container-cards">
            {profile.projects.map((project) => (
              <article className="card-projeto" key={project.id}>
                <div className="projeto-imagem-container">
                  <img
                    className="projeto-imagem"
                    src={`https://picsum.photos/seed/${project.id}/800/400`}
                    alt=""
                    width={800}
                    height={400}
                    loading="lazy"
                  />
                </div>
                <div className="projeto-conteudo">
                  <h3 className="projeto-titulo">{project.title}</h3>
                  <p className="projeto-descricao">{project.description}</p>
                  <div className="projeto-tecnologias">
                    {project.stack.split(/[,;]+/).map((raw) => {
                      const t = raw.trim();
                      return t ? (
                        <span className="tech-tag" key={`${project.id}-${t}`}>
                          {t}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <div className="projeto-botoes">
                    {project.demo_link ? (
                      <a
                        className="btn-repo"
                        href={project.demo_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver Projeto
                      </a>
                    ) : null}
                    {project.github_link ? (
                      <a
                        className="btn-repo btn-repo--outline"
                        href={project.github_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver Repositório
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="contato" className="contato-section">
        <h2 className="contato-titulo">Contato</h2>
        <div className="contato-container">
          <div className="contato-info">
            <p className="contato-subtitulo">
              Entre em contato comigo! Respondo o mais rápido possível.
            </p>
            <ul className="contact-list">
              {profile.email ? (
                <li>
                  <span className="contact-ico" aria-hidden>
                    ✉
                  </span>
                  {profile.email}
                </li>
              ) : null}
              {profile.phone ? (
                <li>
                  <span className="contact-ico" aria-hidden>
                    ☎
                  </span>
                  {profile.phone}
                </li>
              ) : null}
              {profile.location ? (
                <li>
                  <span className="contact-ico" aria-hidden>
                    ⌖
                  </span>
                  {profile.location}
                </li>
              ) : null}
              <li>
                <span className="contact-ico" aria-hidden>
                  ⧉
                </span>
                <a href={profile.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <span className="contact-ico" aria-hidden>
                  ⎗
                </span>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <form className="contato-form" onSubmit={handleContactSubmit}>
            <input type="text" name="nome" placeholder="Nome" required />
            <input type="email" name="email" placeholder="E-mail" required />
            <textarea name="mensagem" placeholder="Mensagem" required />
            <button type="submit">Enviar Mensagem</button>
          </form>
        </div>
      </section>

      <details className="admin-details">
        <summary>Cadastrar novo projeto (painel)</summary>
        <form className="admin-form" onSubmit={handleCreateProject}>
          <input
            placeholder="Título"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <input
            placeholder="Stack (ex.: React, Node, PostgreSQL)"
            value={form.stack}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, stack: e.target.value }))
            }
            required
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            required
          />
          <input
            placeholder="Link da demo"
            value={form.demo_link}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, demo_link: e.target.value }))
            }
          />
          <input
            placeholder="Link do GitHub"
            value={form.github_link}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, github_link: e.target.value }))
            }
          />
          <button type="submit" disabled={saving}>
            {saving ? "Salvando…" : "Cadastrar projeto"}
          </button>
        </form>
      </details>

      <footer className="footer">
        <p>
          © {profile.name} {new Date().getFullYear()}. Criado com amor e muita
          dedicação.
        </p>
      </footer>
    </div>
  );
}

export default App;
