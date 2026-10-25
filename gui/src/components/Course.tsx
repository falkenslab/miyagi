import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { act, upload } from "../api";
import type { CourseTexts } from "../i18n/course";
import { Markdown } from "../markdown";
import type { ChatState, Info } from "../types";
import { Logo } from "./Logo";

// The course views (gui-course-views #51), as the mockup draws them: Hoy, the teaching plan, topics
// and activities, materials, the oven, the knowledge base and the sources. They only read; every
// button that changes something sends a line to the chat, where the agent works and asks for
// approval as always.

export type CourseView = "today" | "plan" | "topics" | "materials" | "oven" | "knowledge" | "sources";

interface Common {
  chat: ChatState;
  info: Info;
  C: CourseTexts;
  /** A line to the chat, as the teacher would type it; the page shows the conversation. */
  ask: (line: string) => void;
  /** Another view (the knowledge base at a page). */
  go: (view: CourseView | "chat", page?: string) => void;
  onLink: () => void;
  linkTitle: string;
}

/** One host action's result, loaded again after every turn (the agent may have changed it). */
function useHost<T>(action: string, data: Record<string, unknown> = {}) {
  const [result, setResult] = useState<T | null>(null);
  const key = JSON.stringify(data);
  const load = useCallback(async () => {
    const answer = await act<T>(action, JSON.parse(key) as Record<string, unknown>).catch(() => null);
    setResult(answer && !answer.error ? answer : null);
  }, [action, key]);
  return { result, load };
}

function useReload(load: () => Promise<void>, chat: ChatState) {
  // Again when a turn ends: what the agent did shows up.
  const turns = chat.turns;
  const busy = chat.busy;
  useEffect(() => {
    if (!busy) void load();
  }, [load, turns, busy]);
}

function Card({ title, badge, children }: { title: ReactNode; badge?: ReactNode; children: ReactNode }) {
  return (
    <div className="card">
      <h3>
        {title}
        {badge}
      </h3>
      {children}
    </div>
  );
}

const day = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

// ---------- Hoy ----------

interface Today {
  pages: number;
  topics: number;
  activities: number;
  teachingPlan: boolean;
  sources: { total: number; pending: number };
  drafts: number;
  oven: { phase: "planning" | "building" | "hidden" | "served"; text: string }[];
  log: { date: string; operation: string; what: string }[];
}

/** The agent's latest reply, cut to a few lines: what it said of the subject when it greeted. */
function lastReply(chat: ChatState): string {
  const reply = [...chat.transcript].reverse().find((entry) => entry.kind === "agent");
  const text = reply && reply.kind === "agent" ? reply.text : "";
  return text.length > 700 ? `${text.slice(0, 700).replace(/\s\S*$/, "")}…` : text;
}

export function TodayView({ chat, info, C, ask, go, onLink, linkTitle }: Common) {
  const { result, load } = useHost<Today>("today");
  useReload(load, chat);
  const connected = Boolean(info.classroom?.connected);
  const greeting = lastReply(chat);
  const tips: { tip: [string, string, string]; run: () => void }[] = [];
  if (result) {
    if (!result.pages && !result.sources.total) tips.push({ tip: C.tips.start, run: () => go("sources") });
    if (result.sources.pending) tips.push({ tip: C.tips.ingest(result.sources.pending), run: () => ask(C.prompts.ingest) });
    if (!result.teachingPlan) tips.push({ tip: C.tips.plan, run: () => ask(C.prompts.plan) });
    if (!connected) tips.push({ tip: [C.tips.classroom[0], C.tips.classroom[1], linkTitle], run: onLink });
    else {
      tips.push({ tip: C.tips.grade, run: () => ask(C.prompts.grade) });
      tips.push({ tip: C.tips.forum, run: () => ask(C.prompts.forum) });
      if (result.teachingPlan) tips.push({ tip: C.tips.align, run: () => ask(C.prompts.align) });
    }
  }
  const phases = result ? (["planning", "building", "hidden", "served"] as const).filter((phase) => result.oven.some((item) => item.phase === phase)) : [];
  return (
    <div className="wrap">
      <div className="card hello">
        <Logo size={46} />
        <div className="grow md">{greeting ? <Markdown text={greeting} /> : <p>{C.hello}</p>}</div>
        <button type="button" className="btn primary" onClick={() => go("chat")}>
          {C.talk}
        </button>
      </div>
      {!result ? (
        <p className="muted">{C.loading}</p>
      ) : (
        <>
          <div className="grid g4">
            <Card title={`📚 ${C.nav.knowledge}`}>
              <div className="kpi">
                {result.pages}
                <small>{C.kpi.pages}</small>
              </div>
              <p>
                {result.topics} {C.kpi.topics} · {result.activities} {C.kpi.activities}
              </p>
              <button type="button" className="btn small" onClick={() => go("knowledge")}>
                {C.nav.knowledge}
              </button>
            </Card>
            <Card title={`🗂️ ${C.nav.sources}`}>
              <div className="kpi">
                {result.sources.pending}
                <small>{C.kpi.pending}</small>
              </div>
              <p>
                {result.sources.total} · sources/
              </p>
              <button type="button" className="btn small" onClick={() => go("sources")}>
                {C.nav.sources}
              </button>
            </Card>
            <Card title={`🔥 ${C.nav.oven}`}>
              <div className="kpi">
                {result.oven.length}
                <small>{C.kpi.oven}</small>
              </div>
              <p>{phases.map((phase) => `${result.oven.filter((item) => item.phase === phase).length} ${C.phases[phase].replace(/^\S+\s/, "").toLowerCase()}`).join(" · ") || "—"}</p>
              <button type="button" className="btn small" onClick={() => go("oven")}>
                {C.nav.oven}
              </button>
            </Card>
            <Card title={`📦 ${C.nav.materials}`}>
              <div className="kpi">
                {result.drafts}
                <small>{C.kpi.drafts}</small>
              </div>
              <p>drafts/</p>
              <button type="button" className="btn small" onClick={() => go("materials")}>
                {C.nav.materials}
              </button>
            </Card>
          </div>
          <h2 className="sec">{C.suggestions}</h2>
          <div className="grid g3">
            {tips.map(({ tip: [title, text, button], run }) => (
              <Card key={title} title={title}>
                <p>{text}</p>
                <button type="button" className="btn small" disabled={chat.busy} onClick={run}>
                  {button}
                </button>
              </Card>
            ))}
          </div>
          <h2 className="sec">{C.recent}</h2>
          <div className="card">
            {result.log.length === 0 ? (
              <p className="muted">{C.noRecent}</p>
            ) : (
              <ul className="list">
                {result.log.map((entry, index) => (
                  <li key={index}>
                    <span className="dot ok" aria-hidden="true" />
                    <span className="grow">
                      <b>{entry.what}</b>
                      <span>
                        {entry.operation} · {day(entry.date)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Programación ----------

interface Page {
  id: string;
  type: string;
  title: string;
  fields: Record<string, string>;
  content: string;
  linkedFrom: string[];
}

export function PlanView({ chat, info, C, ask, go }: Common) {
  const { result, load } = useHost<Page>("kb-page", { id: "course/teaching-plan" });
  const [loaded, setLoaded] = useState(false);
  useReload(
    useCallback(async () => {
      await load();
      setLoaded(true);
    }, [load]),
    chat,
  );
  if (!loaded) return <p className="wrap muted">{C.loading}</p>;
  if (!result)
    return (
      <div className="wrap">
        <div className="card">
          <p>{C.noPlan}</p>
          <button type="button" className="btn primary" disabled={chat.busy} onClick={() => ask(C.prompts.plan)}>
            {C.writePlan}
          </button>
        </div>
      </div>
    );
  return (
    <div className="wrap">
      <div className="row head-row">
        {result.fields.updated && <span className="muted">{day(result.fields.updated)}</span>}
        <span className="sp" />
        {info.classroom?.connected && (
          <button type="button" className="btn small" disabled={chat.busy} onClick={() => ask(C.prompts.align)}>
            {C.alignPlan}
          </button>
        )}
        <button type="button" className="btn small primary" disabled={chat.busy} onClick={() => ask(C.prompts.reviewPlan)}>
          {C.reviewPlan}
        </button>
      </div>
      <div className="card page md">
        <h2>{result.title}</h2>
        <Markdown text={result.content} onPage={(id) => go("knowledge", id)} />
      </div>
    </div>
  );
}

// ---------- Temas y actividades ----------

interface Topic {
  id: string;
  title: string;
  description: string;
  status: string | null;
  activities: { id: string; title: string }[];
}

export function TopicsView({ chat, C, ask, go }: Common) {
  const { result, load } = useHost<{ topics: Topic[] }>("topics");
  useReload(load, chat);
  if (!result) return <p className="wrap muted">{C.loading}</p>;
  return (
    <div className="wrap">
      {result.topics.length === 0 && <div className="card">{C.noTopics}</div>}
      <div className="grid g2">
        {result.topics.map((topic) => (
          <Card key={topic.id} title={`🧱 ${topic.title}`} badge={<span className="badge">{C.activities(topic.activities.length)}</span>}>
            {topic.description && <p>{topic.description}</p>}
            {topic.activities.length > 0 && (
              <div className="chips">
                {topic.activities.map((activity) => (
                  <button key={activity.id} type="button" className="chip" onClick={() => go("knowledge", activity.id)}>
                    {activity.title}
                  </button>
                ))}
              </div>
            )}
            <div className="row">
              <button type="button" className="btn small" onClick={() => go("knowledge", topic.id)}>
                {C.viewPage}
              </button>
              {topic.activities.length === 0 && (
                <button type="button" className="btn small primary" disabled={chat.busy} onClick={() => ask(C.prompts.buildUnit(topic.title))}>
                  {C.prepare}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Materiales ----------

const token = new URLSearchParams(location.search).get("token") ?? "";
const fileUrl = (file: string) => `api/drafts/file?path=${encodeURIComponent(file)}&token=${encodeURIComponent(token)}`;
const kb = (bytes: number) => (bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

function Preview({ file, C }: { file: string | null; C: CourseTexts }) {
  if (!file) return <p className="muted">{C.choose}</p>;
  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext)) return <img className="preview-img" src={fileUrl(file)} alt={file} />;
  if ([".html", ".htm", ".pdf", ".md", ".txt", ".gift", ".csv", ".json", ".xml"].includes(ext))
    // No sandbox attribute for a PDF (the browser's viewer needs it); an HTML one comes with a
    // sandbox policy from the host, so its scripts never run.
    return <iframe className="preview" src={fileUrl(file)} title={file} {...(ext === ".pdf" ? {} : { sandbox: "" })} />;
  return <p className="muted">{file}</p>;
}

export function MaterialsView({ chat, info, C, ask }: Common) {
  const { result, load } = useHost<{ files: { path: string; size: number; changed: string }[] }>("drafts");
  useReload(load, chat);
  const [chosen, setChosen] = useState<string | null>(null);
  if (!result) return <p className="wrap muted">{C.loading}</p>;
  if (!result.files.length)
    return (
      <div className="wrap">
        <div className="card">{C.noMaterials}</div>
      </div>
    );
  return (
    <div className="wrap">
      <div className="row head-row">
        <span className="sp" />
        <button type="button" className="btn small" onClick={() => void act("open-folder", { which: "drafts" })}>
          📂 {C.openFolder}
        </button>
      </div>
      <div className="split">
        <div className="card tbl">
          <table>
            <thead>
              <tr>
                <th>{C.material}</th>
                <th>{C.changed}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {result.files.map((file) => (
                <tr key={file.path} className={file.path === chosen ? "on" : ""}>
                  <td>
                    <button type="button" className="linkish" onClick={() => setChosen(file.path)}>
                      {file.path}
                    </button>
                    <small className="muted block">{kb(file.size)}</small>
                  </td>
                  <td className="muted">{day(file.changed)}</td>
                  <td>
                    {info.classroom?.connected && (
                      <button type="button" className="btn small" disabled={chat.busy} onClick={() => ask(C.prompts.publish(file.path))}>
                        {C.publish}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card preview-box" aria-label={C.preview}>
          <Preview file={chosen} C={C} />
        </div>
      </div>
    </div>
  );
}

// ---------- En el horno ----------

export function OvenView({ chat, info, C, ask }: Common) {
  const { result, load } = useHost<{ items: Today["oven"] }>("oven");
  useReload(load, chat);
  if (!result) return <p className="wrap muted">{C.loading}</p>;
  const label = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "");
  return (
    <div className="wrap">
      {result.items.length === 0 && <div className="card">{C.emptyOven}</div>}
      <div className="oven">
        {(["planning", "building", "hidden", "served"] as const).map((phase) => (
          <div key={phase} className="oven-col">
            <h4>{C.phases[phase]}</h4>
            {result.items
              .filter((item) => item.phase === phase)
              .map((item, index) => (
                <div key={index} className="it">
                  <span className="md">
                    <Markdown text={item.text} />
                  </span>
                  {phase === "hidden" && info.classroom?.connected ? (
                    <button type="button" className="btn small primary" disabled={chat.busy} onClick={() => ask(C.prompts.show(label(item.text)))}>
                      {C.showToStudents}
                    </button>
                  ) : phase !== "served" ? (
                    <button type="button" className="btn small" disabled={chat.busy} onClick={() => ask(C.prompts.resume(label(item.text)))}>
                      {C.resume}
                    </button>
                  ) : null}
                </div>
              ))}
          </div>
        ))}
      </div>
      <p className="muted">{C.ovenNote}</p>
    </div>
  );
}

// ---------- Base de conocimiento ----------

interface Index {
  sections: { type: string; section: string }[];
  pages: { id: string; type: string; title: string; description: string; updated: string | null }[];
  problems: number;
}

export function KnowledgeView({ chat, C, ask, page, setPage }: Common & { page: string | null; setPage: (id: string) => void }) {
  const { result, load } = useHost<Index>("kb-index");
  useReload(load, chat);
  const [shown, setShown] = useState<Page | null>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<{ id: string; title: string; snippet: string }[] | null>(null);
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!page) return setShown(null);
    void act<Page>("kb-page", { id: page }).then((answer) => setShown(answer.error ? null : answer));
    top.current?.scrollIntoView({ block: "nearest" });
  }, [page, chat.turns]);
  const search = async () => setHits(query.trim() ? ((await act<{ hits: { id: string; title: string; snippet: string }[] }>("kb-search", { query })).hits ?? []) : null);
  if (!result) return <p className="wrap muted">{C.loading}</p>;
  if (!result.pages.length)
    return (
      <div className="wrap">
        <div className="card">{C.emptyKb}</div>
      </div>
    );
  return (
    <div className="wrap" ref={top}>
      <form
        className="row head-row"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          void search();
        }}
      >
        <input className="field search-field" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={C.searchKb} aria-label={C.searchKb} />
        <span className="sp" />
        <span className={`badge ${result.problems ? "warn" : "ok"}`}>{result.problems ? C.problems(result.problems) : C.noProblems}</span>
        <button type="button" className="btn small" disabled={chat.busy} onClick={() => ask(C.prompts.lint)}>
          {C.lint}
        </button>
      </form>
      <div className="kb">
        <nav className="card tree" aria-label={C.nav.knowledge}>
          {hits ? (
            <div className="grp">
              <b>{C.search}</b>
              {hits.length === 0 && <p className="muted small">{C.noHits}</p>}
              {hits.map((hit) => (
                <a key={hit.id} role="button" tabIndex={0} className={hit.id === page ? "on" : ""} onClick={() => setPage(hit.id)} onKeyDown={(event) => event.key === "Enter" && setPage(hit.id)}>
                  {hit.title}
                  <small className="muted block">{hit.snippet}</small>
                </a>
              ))}
            </div>
          ) : (
            result.sections
              .filter((section) => result.pages.some((one) => one.type === section.type))
              .map((section) => (
                <div key={section.type} className="grp">
                  <b>{C.sections[section.type] ?? section.section}</b>
                  {result.pages
                    .filter((one) => one.type === section.type)
                    .map((one) => (
                      <a key={one.id} role="button" tabIndex={0} title={one.description} className={one.id === page ? "on" : ""} onClick={() => setPage(one.id)} onKeyDown={(event) => event.key === "Enter" && setPage(one.id)}>
                        {one.title}
                      </a>
                    ))}
                </div>
              ))
          )}
        </nav>
        <article className="card page md">
          {!shown ? (
            <p className="muted">{C.pickPage}</p>
          ) : (
            <>
              <h2>{shown.title}</h2>
              <div className="meta">
                {shown.id}
                {shown.fields.updated && ` · ${day(shown.fields.updated)}`}
                {shown.fields.file && ` · sources/${shown.fields.file}`}
              </div>
              <Markdown text={shown.content} onPage={setPage} />
              {shown.linkedFrom.length > 0 && (
                <p className="muted small">
                  {C.linkedFrom}:{" "}
                  {shown.linkedFrom.map((id, index) => (
                    <span key={id}>
                      {index > 0 && ", "}
                      <a href={`#${id}`} className="page-link" onClick={(event) => (event.preventDefault(), setPage(id))}>
                        {id}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </>
          )}
        </article>
      </div>
    </div>
  );
}

// ---------- Fuentes ----------

interface Source {
  path: string;
  size: number;
  changed: string;
  state: "new" | "changed" | "ingested";
  page: string | null;
}

export function SourcesView({ chat, C, ask, go, onNotice }: Common & { onNotice: (text: string) => void }) {
  const { result, load } = useHost<{ sources: Source[] }>("sources");
  useReload(load, chat);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const add = async (files: FileList | null) => {
    for (const one of Array.from(files ?? [])) {
      const answer = await upload(one);
      onNotice(answer.error ? `${one.name}: ${answer.error}` : answer.duplicateOf ? `${one.name} ✓ (${answer.duplicateOf})` : `${one.name} → sources/`);
    }
    await load();
  };
  const pending = result?.sources.filter((source) => source.state !== "ingested").length ?? 0;
  const badge = { new: "sun", changed: "warn", ingested: "ok" } as const;
  return (
    <div className="wrap">
      <div
        className={`drop ${over ? "over" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          void add(event.dataTransfer.files);
        }}
      >
        <p>{C.drop}</p>
        <div className="row center-row">
          <button type="button" className="btn small" disabled={chat.busy} onClick={() => input.current?.click()}>
            {C.chooseFiles}
          </button>
          <button type="button" className="btn small" onClick={() => void act("open-folder", { which: "sources" })}>
            📂 {C.openFolder}
          </button>
          {pending > 0 && (
            <>
              <span className="muted">{C.or}</span>
              <button type="button" className="btn small primary" disabled={chat.busy} onClick={() => ask(C.prompts.ingest)}>
                {C.ingestAll}
              </button>
            </>
          )}
        </div>
        <input ref={input} type="file" multiple hidden onChange={(event) => void add(event.target.files).then(() => (event.target.value = ""))} />
      </div>
      {!result ? (
        <p className="muted">{C.loading}</p>
      ) : result.sources.length === 0 ? (
        <p className="muted">{C.noSources}</p>
      ) : (
        <div className="card tbl sources">
          <table>
            <thead>
              <tr>
                <th>{C.file}</th>
                <th>{C.state}</th>
                <th>{C.page}</th>
              </tr>
            </thead>
            <tbody>
              {result.sources.map((source) => (
                <tr key={source.path}>
                  <td>
                    <code>{source.path}</code>
                    <small className="muted block">
                      {kb(source.size)} · {day(source.changed)}
                    </small>
                  </td>
                  <td>
                    <span className={`badge ${badge[source.state]}`}>{C.states[source.state]}</span>
                  </td>
                  <td>
                    {source.page ? (
                      <a href={`#${source.page}`} className="page-link" onClick={(event) => (event.preventDefault(), go("knowledge", source.page!))}>
                        {source.page}
                      </a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
