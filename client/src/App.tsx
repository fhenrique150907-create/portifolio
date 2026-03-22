import { useEffect, useState } from "react";
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
  projects: Project[];
};

const fallbackProfile: Profile = {
  name: "Seu Nome",
  role: "Desenvolvedor Full Stack",
  bio: "Construo sites e APIs para ajudar negocios a crescerem no digital.",
  instagram: "https://instagram.com/seuusuario",
  whatsapp: "https://wa.me/5500000000000",
  projects: [],
};

function App() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("http://localhost:4000/api/profile");
        if (!response.ok) {
          throw new Error("Falha ao carregar dados da API");
        }
        const data = (await response.json()) as Profile;
        setProfile(data);
      } catch (_error) {
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="badge">Portfolio</p>
        <h1>{profile.name}</h1>
        <h2>{profile.role}</h2>
        <p className="bio">{profile.bio}</p>
        <div className="actions">
          <a href={profile.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={profile.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </section>

      <section className="projects">
        <h3>Projetos</h3>
        {loading ? (
          <p>Carregando projetos...</p>
        ) : (
          <div className="cards">
            {profile.projects.map((project) => (
              <article className="card" key={project.id}>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <p className="stack">{project.stack}</p>
                <div className="project-links">
                  {project.demo_link ? (
                    <a href={project.demo_link} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  ) : null}
                  {project.github_link ? (
                    <a href={project.github_link} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
