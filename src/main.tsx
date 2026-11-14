import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { places } from "./places.mjs";
import { PlaceIcon } from "./PlaceIcon";
import { projects } from "./projects";
import "./style.css";
const World = lazy(() => import("./World"));
class ErrorBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [reset, setReset] = useState(0);
  const [night, setNight] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [mode, setMode] = useState<"3d" | "2d">(() => {
    try {
      return document.createElement("canvas").getContext("webgl2")
        ? "3d"
        : "2d";
    } catch {
      return "2d";
    }
  });
  const dialog = useRef<HTMLDialogElement>(null);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const onUnavailable = useCallback(() => {
    setUnavailable(true);
    setMode("2d");
  }, []);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (selected) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [selected]);
  const active = places.find((p) => p.id === selected);
  return (
    <div className="app" data-theme={night ? "night" : "day"}>
      <header>
        <div className="brand">
          ◈ DEV<span>ISLAND</span>
          <small>INTERACTIVE PORTFOLIO</small>
        </div>
        <nav aria-label="포트폴리오 메뉴">
          {places.map((p) => (
            <button
              key={p.id}
              aria-haspopup="dialog"
              onClick={() => setSelected(p.id)}
            >
              {p.subtitle}
            </button>
          ))}
        </nav>
        <a
          className="git"
          href="https://github.com/BaekJaeYeol"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </header>
      <main id="main-content">
        <section className="intro">
          <div className="eyebrow">
            <span className="status-dot" /> BAEK JAEYEOL · DEVELOPER
          </div>
          <h1>
            Explore my
            <br />
            <em>little world.</em>
          </h1>
          <p>
            작은 섬에 담은 개발 이야기.
            <br />
            건물을 클릭해 프로젝트와 경험을 둘러보세요.
          </p>
          <button className="primary" onClick={() => setSelected("projects")}>
            프로젝트 둘러보기 <span aria-hidden="true">↗</span>
          </button>
          <button
            className="secondary"
            onClick={() => {
              setUnavailable(false);
              setMode(mode === "3d" ? "2d" : "3d");
            }}
          >
            {mode === "3d" ? "2D 보기" : "3D 보기"}
          </button>
          <div className="intro-caption">
            설계하고, 만들고, 검증하는 과정의 기록.
          </div>
        </section>
        <section
          data-mode={mode}
          className="world-panel"
          aria-label="인터랙티브 포트폴리오"
        >
          <div className="world-heading">
            <span>THE ISLAND</span>
            <span>{mode === "3d" ? "3D 탐색" : "2D 탐색"}</span>
          </div>
          <div className="scene" aria-label="미니어처 월드">
            {mode === "3d" ? (
              <ErrorBoundary key={mode} onError={onUnavailable}>
                <Suspense
                  fallback={
                    <div className="scene-loading" role="status">
                      섬을 준비하고 있어요…
                    </div>
                  }
                >
                  <World
                    select={setSelected}
                    reset={reset}
                    selected={selected}
                    night={night}
                    reducedMotion={reducedMotion}
                    onUnavailable={onUnavailable}
                  />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <div className="grid">
                {places.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    style={{ borderTop: "6px solid " + p.color }}
                  >
                    <PlaceIcon place={p} />
                    <span className="place-category">{p.subtitle}</span>
                    <strong>{p.name}</strong>
                    <span className="card-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="world-bottom">
            <div className="hint">
              {mode === "3d"
                ? "드래그 회전 · 스크롤 확대 · 건물 클릭"
                : "카드를 선택해 프로젝트와 경험을 둘러보세요"}
            </div>
            <div className="world-actions">
              <button
                disabled={mode === "2d"}
                aria-pressed={night}
                onClick={() => setNight((v) => !v)}
              >
                {night ? "☀ 낮 모드" : "☾ 밤 모드"}
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setReset((x) => x + 1);
                }}
              >
                ↻ 처음 시점
              </button>
            </div>
          </div>
          {mode === "2d" && (
            <p className="view-note" role="status">
              {unavailable
                ? "3D 화면을 표시할 수 없어 2D로 전환했어요."
                : "2D에서도 모든 프로젝트와 경험을 둘러볼 수 있어요."}
            </p>
          )}
        </section>
      </main>
      <footer>
        <span>© 2026 DEV ISLAND · 백재열</span>
        <span>작은 섬, 계속 자라는 이야기.</span>
      </footer>
      <dialog
        ref={dialog}
        aria-labelledby="place-title"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {active && (
          <>
            <button
              className="close"
              onClick={() => setSelected(null)}
              aria-label="닫기"
            >
              ✕
            </button>
            <div className="eyebrow">{active.subtitle.toUpperCase()}</div>
            <div className="illustration" style={{ background: active.color }}>
              <PlaceIcon place={active} />
            </div>
            <h2 id="place-title">{active.name}</h2>
            <p>{active.description}</p>
            {active.id === "projects" && (
              <div className="project-list">
                {projects.map((pr) => (
                  <article key={pr.id} className="project-card">
                    <h3>{pr.title}</h3>
                    <p>{pr.summary}</p>
                    <div className="chips">
                      {pr.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <p>
                      <strong>담당:</strong> {pr.role}
                    </p>
                    <ul>
                      {pr.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    {pr.github && (
                      <a
                        href={pr.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub 저장소 ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
            {active.id === "contact" && (
              <a
                href="https://github.com/BaekJaeYeol"
                target="_blank"
                rel="noreferrer"
              >
                GitHub 방문 ↗
              </a>
            )}
            <small>DEV ISLAND · {places.indexOf(active) + 1}/5</small>
          </>
        )}
      </dialog>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
