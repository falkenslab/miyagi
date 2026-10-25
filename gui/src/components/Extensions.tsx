import { useCallback, useEffect, useState } from "react";
import { act, logoUrl } from "../api";
import type { ExtTexts } from "../i18n/extensions";
import type { Capabilities, CatalogEntry, ChatState, ExtensionOptionState, Info, InstalledExtension, Repository } from "../types";
import { Dialog } from "./Panel";

// The extensions view (gui-extensions #50), as the mockup draws it: tabs for what's installed (cards
// with a switch), the catalog, the repositories and what miyagi can do; an extension's details and
// installing one in a dialog. The classroom view and its three-step "link a classroom". Every
// action goes to the host, which goes to the kit; the page keeps nothing of its own.

export type ExtTab = "installed" | "catalog" | "repositories" | "capabilities";
type Notice = (text: string) => void;

/** The extension a classroom goes through: linked with the wizard, not just installed. */
const CLASSROOM_EXTENSION = "moodle-teacher";

/** An action whose `error` becomes a notice; the result otherwise. */
async function run<T>(action: string, data: Record<string, unknown>, X: ExtTexts, onNotice: Notice): Promise<(T & { error?: string }) | null> {
  try {
    const result = await act<T>(action, data);
    if (result.error) {
      onNotice(result.error === "busy" ? X.busy : X.failed(result.error));
      return null;
    }
    return result;
  } catch (error) {
    onNotice(X.failed(String((error as Error)?.message ?? error)));
    return null;
  }
}

const hostOf = (address: string) => {
  try {
    return new URL(address).host;
  } catch {
    return address;
  }
};

/** The catalog, loaded again when what's installed changes. */
function useCatalog(chat: ChatState, X: ExtTexts, onNotice: Notice) {
  const [entries, setEntries] = useState<CatalogEntry[] | null>(null);
  const load = useCallback(
    async (words = "") => {
      const result = await run<{ entries: CatalogEntry[] }>("catalog", { words }, X, onNotice);
      setEntries(result?.entries ?? []);
    },
    [X, onNotice],
  );
  const installed = (chat.extensions?.installed ?? []).map((ext) => `${ext.name}${ext.version}`).join(",");
  useEffect(() => {
    void load();
  }, [load, installed]);
  return { entries, load };
}

export function ExtensionsView({ chat, info, X, tab, setTab, onNotice, onLink }: { chat: ChatState; info: Info; X: ExtTexts; tab: ExtTab; setTab: (tab: ExtTab) => void; onNotice: Notice; onLink: () => void }) {
  const { entries, load } = useCatalog(chat, X, onNotice);
  // The extension whose details are open, and the catalog entry being added.
  const [details, setDetails] = useState<string | null>(null);
  const [adding, setAdding] = useState<CatalogEntry | null>(null);
  const tabs: ExtTab[] = ["installed", "catalog", "repositories", "capabilities"];
  const add = (entry: CatalogEntry) => (entry.name === CLASSROOM_EXTENSION && !info.classroom ? onLink() : setAdding(entry));
  return (
    <div className="wrap">
      <div className="tabs" role="tablist">
        {tabs.map((name) => (
          <button key={name} type="button" role="tab" aria-selected={tab === name} className={tab === name ? "on" : ""} onClick={() => setTab(name)}>
            {X.tabs[name]}
          </button>
        ))}
      </div>
      {tab === "installed" && <InstalledTab chat={chat} entries={entries} X={X} onNotice={onNotice} onDetails={setDetails} />}
      {tab === "catalog" && <CatalogTab chat={chat} entries={entries} X={X} onSearch={load} onAdd={add} />}
      {tab === "repositories" && <RepositoriesTab X={X} onNotice={onNotice} onChanged={() => void load()} />}
      {tab === "capabilities" && <CapabilitiesTab chat={chat} info={info} entries={entries} X={X} onNotice={onNotice} onAdd={add} onLink={onLink} />}
      {details && <DetailsDialog name={details} chat={chat} entry={entries?.find((entry) => entry.name === details)} X={X} onNotice={onNotice} onClose={() => setDetails(null)} />}
      {adding && (
        <AddDialog
          entry={adding}
          chat={chat}
          X={X}
          onNotice={onNotice}
          onClose={() => setAdding(null)}
          onNeedsOptions={(name) => {
            setAdding(null);
            setTab("installed");
            setDetails(name);
          }}
        />
      )}
    </div>
  );
}

/** A logo from the repository's copy, or a piece of a puzzle. */
function ExtLogo({ entry }: { entry?: CatalogEntry }) {
  return <span className="logo">{entry?.logo ? <img src={logoUrl(entry.spec)} alt="" width={38} height={38} /> : <span aria-hidden="true">🧩</span>}</span>;
}

function InstalledTab({ chat, entries, X, onNotice, onDetails }: { chat: ChatState; entries: CatalogEntry[] | null; X: ExtTexts; onNotice: Notice; onDetails: (name: string) => void }) {
  const status = chat.extensions;
  const [working, setWorking] = useState(false);
  const update = async (name?: string) => {
    setWorking(true);
    const result = await run<{ updated: string[] }>("update", name ? { name } : {}, X, onNotice);
    if (result) onNotice(result.updated.length ? X.updated(result.updated.join(", ")) : X.upToDate);
    if (result?.updated.length) await run("reload", {}, X, onNotice);
    setWorking(false);
  };
  if (!status) return <p className="muted">{X.loading}</p>;
  const disabled = working || chat.busy;
  return (
    <>
      {status.untrusted.length > 0 && (
        <div className="warnbox">
          <b>{X.trustTitle}</b>
          <p>{X.trustText(status.untrusted.map((ext) => ext.name).join(", "))}</p>
          <button type="button" className="btn small primary" disabled={disabled} onClick={() => void run("trust", {}, X, onNotice)}>
            {X.trust}
          </button>
        </div>
      )}
      <div className="row head-row">
        <span className="muted">{X.installNote}</span>
        <span className="sp" />
        {status.installed.some((ext) => ext.marketplace) && (
          <button type="button" className="btn small" disabled={disabled} onClick={() => void update()}>
            {X.updateAll}
          </button>
        )}
      </div>
      {status.installed.length === 0 && <p className="muted">{X.noneInstalled}</p>}
      <div className="grid g3">
        {status.installed.map((ext) => (
          <InstalledCard key={ext.name} ext={ext} entry={entries?.find((entry) => entry.name === ext.name)} off={status.inactive.find((inactive) => inactive.name === ext.name)?.reason} disabled={disabled} X={X} onNotice={onNotice} onUpdate={() => void update(ext.name)} onDetails={() => onDetails(ext.name)} />
        ))}
      </div>
    </>
  );
}

function InstalledCard({ ext, entry, off, disabled, X, onNotice, onUpdate, onDetails }: { ext: InstalledExtension; entry?: CatalogEntry; off?: string; disabled: boolean; X: ExtTexts; onNotice: Notice; onUpdate: () => void; onDetails: () => void }) {
  return (
    <div className="card ext">
      <div className="head">
        <ExtLogo entry={entry} />
        <span className="name">
          <b>{ext.name}</b>
          <span>
            {ext.marketplace ? `${ext.marketplace.split("@")[1] ?? ext.marketplace}/${ext.name}` : ext.name}
            {ext.version && ` · v${ext.version}`}
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={ext.enabled}
          aria-label={`${ext.name}: ${ext.enabled ? X.on : X.off}`}
          className={`switch ${ext.enabled ? "on" : ""}`}
          disabled={disabled}
          onClick={() => void run("extension", { name: ext.name, enabled: !ext.enabled }, X, onNotice)}
        />
      </div>
      <p>{entry?.description || ext.description}</p>
      {entry && entry.capabilities.length > 0 && (
        <div className="caps">
          {entry.capabilities.map((capability) => (
            <code key={capability.id} title={capability.description}>
              {capability.label}
            </code>
          ))}
        </div>
      )}
      {entry && entry.requirements.length > 0 && <div className="muted small">{X.needs(entry.requirements.map((requirement) => requirement.name).join(", "))}</div>}
      {ext.enabled && off && <div className="warn-text small">{X.notRunning(off)}</div>}
      <div className="foot">
        {entry?.update ? (
          <>
            <span className="badge sun">{X.updateAvailable}</span>
            <button type="button" className="btn small" disabled={disabled} onClick={onUpdate}>
              {X.update}
            </button>
          </>
        ) : (
          <span className="badge ok">{X.upToDateBadge}</span>
        )}
        <span className="sp" />
        <button type="button" className="btn small ghost" onClick={onDetails}>
          {X.details}
        </button>
      </div>
    </div>
  );
}

/** What an extension declares: where it sends data and what it needs on the computer. */
function Declarations({ entry, X }: { entry?: CatalogEntry; X: ExtTexts }) {
  if (!entry) return null;
  return (
    <div className="decl">
      <span aria-hidden="true">🌐</span>
      <span>{X.network}</span>
      <span className={`badge ${entry.remote.length ? "warn" : "ok"}`}>{entry.remote.length ? entry.remote.join(", ") : X.onlyThisComputer}</span>
      <span aria-hidden="true">🖥️</span>
      <span>{X.requires}</span>
      <span className={`badge ${entry.requirements.length ? "warn" : "ok"}`}>{entry.requirements.length ? entry.requirements.map((requirement) => requirement.name).join(", ") : X.nothing}</span>
    </div>
  );
}

function CapabilityCodes({ entry, X }: { entry?: CatalogEntry; X: ExtTexts }) {
  if (!entry?.capabilities.length) return null;
  return (
    <>
      <label className="lb">{X.gives}</label>
      <div className="ext caps-only">
        <div className="caps">
          {entry.capabilities.map((capability) => (
            <code key={capability.id} title={capability.description}>
              {capability.label}
            </code>
          ))}
        </div>
      </div>
    </>
  );
}

/** An installed extension's details: what it declares, its options, and removing it. */
function DetailsDialog({ name, chat, entry, X, onNotice, onClose }: { name: string; chat: ChatState; entry?: CatalogEntry; X: ExtTexts; onNotice: Notice; onClose: () => void }) {
  const ext = chat.extensions?.installed.find((installed) => installed.name === name);
  const [removing, setRemoving] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const remove = async () => {
    if (await run("remove", { name, deleteData }, X, onNotice)) {
      onNotice(X.removed(name));
      onClose();
    }
  };
  return (
    <Dialog title={name} onEscape={onClose}>
      <p className="muted mono">
        {entry?.spec ?? name}
        {ext?.version && ` · v${ext.version}`}
      </p>
      <p>{entry?.description || ext?.description}</p>
      <label className="lb">{X.declares}</label>
      <Declarations entry={entry} X={X} />
      <CapabilityCodes entry={entry} X={X} />
      <label className="lb">{X.options}</label>
      <OptionsForm name={name} busy={chat.busy} X={X} onNotice={onNotice} onSaved={onClose} />
      {removing ? (
        <div className="dangerbox">
          <b>{X.removeTitle(name)}</b>
          <p>{X.removeText}</p>
          <label className="check">
            <input type="checkbox" checked={deleteData} onChange={(event) => setDeleteData(event.target.checked)} />
            <span>{X.removeData}</span>
          </label>
          <div className="acts">
            <button type="button" className="btn ghost" onClick={() => setRemoving(false)}>
              {X.cancel}
            </button>
            <button type="button" className="btn danger" disabled={chat.busy} onClick={() => void remove()}>
              {X.remove}
            </button>
          </div>
        </div>
      ) : (
        <div className="acts">
          <button type="button" className="btn ghost" onClick={onClose}>
            {X.close}
          </button>
          <button type="button" className="btn danger" disabled={chat.busy} onClick={() => setRemoving(true)}>
            {X.remove}
          </button>
        </div>
      )}
    </Dialog>
  );
}

/** A value as the form shows it: a list comma-separated. */
const shown = (value: ExtensionOptionState["value"]) => (value === undefined ? "" : Array.isArray(value) ? value.join(",") : String(value));

/**
 * An installed extension's options as a form. A sensitive one is never shown, only whether it's
 * saved; left empty, it isn't sent and keeps its value. Only what changed goes back.
 */
function OptionsForm({ name, busy, X, onNotice, onSaved }: { name: string; busy: boolean; X: ExtTexts; onNotice: Notice; onSaved: () => void }) {
  const [states, setStates] = useState<ExtensionOptionState[] | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    void run<{ options: ExtensionOptionState[] }>("options", { name }, X, onNotice).then((result) => {
      if (!result) return;
      setStates(result.options);
      setValues(Object.fromEntries(result.options.map((state) => [state.key, state.option.sensitive ? "" : shown(state.value)])));
    });
  }, [name, X, onNotice]);
  if (!states) return <p className="muted">{X.loading}</p>;
  if (!states.length) return <p className="muted">{X.noOptions}</p>;
  const save = async () => {
    const changed: Record<string, string | null> = {};
    for (const state of states) {
      const value = values[state.key] ?? "";
      if (state.option.sensitive) {
        if (value) changed[state.key] = value;
      } else if (value !== shown(state.value)) {
        changed[state.key] = value === "" ? null : value;
      }
    }
    setSaving(true);
    const result = await run("set-options", { name, values: changed }, X, onNotice);
    setSaving(false);
    if (result) {
      onNotice(X.saved);
      onSaved();
    }
  };
  const set = (key: string, value: string) => setValues((now) => ({ ...now, [key]: value }));
  return (
    <form
      className="ext-options"
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      {states.map(({ key, option, set: isSet }) => {
        const id = `opt-${name}-${key}`;
        return (
          <div key={key} className="form-field">
            {option.type === "boolean" ? (
              <label className="check">
                <input type="checkbox" checked={values[key] === "true"} onChange={(event) => set(key, String(event.target.checked))} />
                <span>{option.title}</span>
              </label>
            ) : (
              <label className="lb" htmlFor={id}>
                {option.title}
                {option.required && " *"}
              </label>
            )}
            {option.type !== "boolean" &&
              (option.options ? (
                <select id={id} className="field" value={values[key]} onChange={(event) => set(key, event.target.value)}>
                  {option.options.map((choice) => (
                    <option key={String(choice)} value={String(choice)}>
                      {String(choice)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  className="field"
                  type={option.sensitive ? "password" : option.type === "number" ? "number" : "text"}
                  value={values[key]}
                  placeholder={option.sensitive ? (isSet ? X.secretSet : X.secretUnset) : ""}
                  onChange={(event) => set(key, event.target.value)}
                />
              ))}
            <small className="muted">
              {option.description}
              {option.multiple && ` ${X.listHelp}`}
            </small>
          </div>
        );
      })}
      <div className="acts">
        <button type="submit" className="btn primary" disabled={saving || busy}>
          {X.save}
        </button>
      </div>
    </form>
  );
}

/**
 * Adding an extension from the catalog: what it declares first, and for one of a repository that
 * isn't the official one, the warning; then into the running session, or its options when it
 * needs them before it can run.
 */
function AddDialog({ entry, chat, X, onNotice, onClose, onNeedsOptions }: { entry: CatalogEntry; chat: ChatState; X: ExtTexts; onNotice: Notice; onClose: () => void; onNeedsOptions: (name: string) => void }) {
  const [installing, setInstalling] = useState(false);
  const install = async () => {
    setInstalling(true);
    // The person read the warning in this dialog: that's the confirmation the kit asks for.
    const result = await run<{ name?: string; confirm?: unknown }>("install", { spec: entry.spec, confirmed: !entry.official }, X, onNotice);
    if (result?.name) {
      const options = await run<{ options: ExtensionOptionState[] }>("options", { name: result.name }, X, onNotice);
      if (options?.options.some((state) => state.option.required && !state.set)) {
        onNotice(X.needsOptions(result.name));
        onNeedsOptions(result.name);
        return;
      }
      if (await run("reload", {}, X, onNotice)) onNotice(X.installedNow(result.name));
      onClose();
      return;
    }
    setInstalling(false);
  };
  return (
    <Dialog title={X.addTitle(entry.name)} onEscape={onClose}>
      <p className="muted mono">
        {entry.spec}
        {entry.version && ` · v${entry.version}`}
      </p>
      <p>{entry.description}</p>
      <label className="lb">{X.declares}</label>
      <Declarations entry={entry} X={X} />
      <CapabilityCodes entry={entry} X={X} />
      {!entry.official && (
        <div className="dangerbox">
          <b>{X.foreignTitle(entry.marketplace)}</b>
          <p>{X.foreignText}</p>
        </div>
      )}
      <p className="muted small">{X.installNote}</p>
      <div className="acts">
        <button type="button" className="btn ghost" onClick={onClose}>
          {X.cancel}
        </button>
        <button type="button" className={`btn ${entry.official ? "primary" : "danger"}`} disabled={installing || chat.busy} onClick={() => void install()}>
          {installing ? X.installing : entry.official ? X.addButton : X.installAnyway}
        </button>
      </div>
    </Dialog>
  );
}

function CatalogTab({ chat, entries, X, onSearch, onAdd }: { chat: ChatState; entries: CatalogEntry[] | null; X: ExtTexts; onSearch: (words: string) => Promise<void>; onAdd: (entry: CatalogEntry) => void }) {
  const [words, setWords] = useState("");
  return (
    <>
      <form
        className="row head-row"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          void onSearch(words);
        }}
      >
        <input className="field search-field" type="search" value={words} onChange={(event) => setWords(event.target.value)} placeholder={X.search} aria-label={X.search} />
      </form>
      {!entries ? (
        <p className="muted">{X.loading}</p>
      ) : entries.length === 0 ? (
        <p className="muted">{X.noResults}</p>
      ) : (
        <div className="grid g3">
          {entries.map((entry) => (
            <div key={entry.spec} className="card ext">
              <div className="head">
                <ExtLogo entry={entry} />
                <span className="name">
                  <b>{entry.name}</b>
                  <span>
                    {!entry.official && "⚠️ "}
                    {entry.marketplace}/{entry.name}
                    {entry.version && ` · v${entry.version}`}
                  </span>
                </span>
              </div>
              <p>{entry.description}</p>
              {entry.capabilities.length > 0 && (
                <div className="caps">
                  {entry.capabilities.map((capability) => (
                    <code key={capability.id} title={capability.description}>
                      {capability.label}
                    </code>
                  ))}
                </div>
              )}
              {entry.requirements.length > 0 && <div className="muted small">{X.needs(entry.requirements.map((requirement) => requirement.name).join(", "))}</div>}
              <div className="foot">
                {!entry.official && <span className="badge warn">{X.foreignBadge}</span>}
                <span className="sp" />
                {entry.installed ? (
                  <span className="badge ok">{X.installed}</span>
                ) : (
                  <button type="button" className="btn small primary" disabled={chat.busy} onClick={() => onAdd(entry)}>
                    {entry.name === CLASSROOM_EXTENSION ? X.linkTitle : X.addButton}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function RepositoriesTab({ X, onNotice, onChanged }: { X: ExtTexts; onNotice: Notice; onChanged: () => void }) {
  const [repos, setRepos] = useState<Repository[] | null>(null);
  const [adding, setAdding] = useState(false);
  const load = useCallback(async () => {
    const result = await run<{ marketplaces: Repository[] }>("marketplaces", {}, X, onNotice);
    setRepos(result?.marketplaces ?? []);
  }, [X, onNotice]);
  useEffect(() => {
    void load();
  }, [load]);
  const forget = async (name: string) => {
    if (await run("remove-marketplace", { name }, X, onNotice)) {
      onNotice(X.forgotten(name));
      void load();
      onChanged();
    }
  };
  return (
    <>
      <div className="card">
        {!repos ? (
          <p className="muted">{X.loading}</p>
        ) : (
          <ul className="list">
            {repos.map((repo) => (
              <li key={repo.name}>
                <span aria-hidden="true">{repo.official ? "✅" : "⚠️"}</span>
                <span className="grow">
                  <b>
                    {repo.name} {repo.official ? <span className="badge ok">{X.official}</span> : <span className="badge warn">{X.foreignBadge}</span>}
                  </b>
                  <span>
                    {repo.source}
                    {repo.extensions !== null && ` · ${X.extensionsCount(repo.extensions)}`}
                  </span>
                  {repo.description && <span className="block">{repo.description}</span>}
                </span>
                {!repo.official && (
                  <button type="button" className="btn small ghost" onClick={() => void forget(repo.name)}>
                    {X.forget}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="row head-row">
        <button type="button" className="btn" onClick={() => setAdding(true)}>
          ＋ {X.addRepo}
        </button>
      </div>
      {adding && (
        <AddRepositoryDialog
          X={X}
          onNotice={onNotice}
          onClose={() => setAdding(false)}
          onAdded={() => {
            setAdding(false);
            void load();
            onChanged();
          }}
        />
      )}
    </>
  );
}

/** Adding a repository: read first, the warning, and its name typed, as the kit's command asks. */
function AddRepositoryDialog({ X, onNotice, onClose, onAdded }: { X: ExtTexts; onNotice: Notice; onClose: () => void; onAdded: () => void }) {
  const [source, setSource] = useState("");
  const [found, setFound] = useState<{ name: string; owner: string; description: string | null; extensions: number } | null>(null);
  const [typed, setTyped] = useState("");
  const [working, setWorking] = useState(false);
  const review = async () => {
    setWorking(true);
    setFound(null);
    setTyped("");
    const result = await run<{ name: string; owner: string; description: string | null; extensions: number }>("inspect-marketplace", { source }, X, onNotice);
    setWorking(false);
    if (result) setFound(result);
  };
  const add = async () => {
    setWorking(true);
    const result = await act<{ name?: string }>("add-marketplace", { source, typed });
    setWorking(false);
    if (result.error === "name mismatch") onNotice(X.nameMismatch);
    else if (result.error) onNotice(X.failed(result.error));
    else if (result.name) {
      onNotice(X.added(result.name));
      onAdded();
    }
  };
  return (
    <Dialog title={X.addRepo} onEscape={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (found && typed === found.name) void add();
          else if (!found) void review();
        }}
      >
        <label className="lb" htmlFor="repo-source">
          {X.repoSource}
        </label>
        <input
          id="repo-source"
          className="field"
          value={source}
          placeholder="github.com/mi-centro/miyagi-extensiones"
          onChange={(event) => {
            setSource(event.target.value);
            setFound(null);
          }}
        />
        <small className="muted">{X.repoSourceHelp}</small>
        {found && (
          <>
            <p>
              <b>{X.repoBy(found.name, found.owner)}</b> <span className="muted">· {X.extensionsCount(found.extensions)}</span>
            </p>
            {found.description && <p className="muted">{found.description}</p>}
            <div className="dangerbox">{X.repoWarning}</div>
            <label className="lb" htmlFor="repo-name">
              {X.typeName(found.name)}
            </label>
            <input id="repo-name" className="field" value={typed} onChange={(event) => setTyped(event.target.value)} autoComplete="off" spellCheck={false} />
          </>
        )}
        <div className="acts">
          <button type="button" className="btn ghost" onClick={onClose}>
            {X.cancel}
          </button>
          {found ? (
            <button type="submit" className="btn danger" disabled={working || typed !== found.name}>
              {X.add}
            </button>
          ) : (
            <button type="submit" className="btn primary" disabled={working || !source.trim()}>
              {X.review}
            </button>
          )}
        </div>
      </form>
    </Dialog>
  );
}

/** What miyagi can do, as the mockup's table: "I can…", thanks to what, and what's missing. */
function CapabilitiesTab({ chat, info, entries, X, onNotice, onAdd, onLink }: { chat: ChatState; info: Info; entries: CatalogEntry[] | null; X: ExtTexts; onNotice: Notice; onAdd: (entry: CatalogEntry) => void; onLink: () => void }) {
  const [caps, setCaps] = useState<Capabilities | null>(null);
  const active = (chat.extensions?.active ?? []).join(",");
  useEffect(() => {
    void run<Capabilities>("capabilities", {}, X, onNotice).then((result) => result && setCaps(result));
    // Again whenever what runs changes: an install, a switch.
  }, [active, X, onNotice]);
  const room = info.classroom;
  return (
    <>
      <div className="card tbl">
        <table>
          <thead>
            <tr>
              <th>{X.canI}</th>
              <th>{X.thanksTo}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{X.coreRow}</td>
              <td className="muted">{X.core}</td>
              <td>
                <span className="badge ok">{X.yes}</span>
              </td>
            </tr>
            <tr>
              <td>{X.classroomRow}</td>
              <td className="muted">{room ? `${CLASSROOM_EXTENSION} · ${hostOf(room.url)}` : "—"}</td>
              <td>
                {room?.connected ? (
                  <span className="badge ok">{X.yes}</span>
                ) : (
                  <button type="button" className="btn small" disabled={chat.busy} onClick={onLink}>
                    {room ? X.classroomReconnect : X.linkTitle}
                  </button>
                )}
              </td>
            </tr>
            {caps?.have.flatMap((ext) =>
              ext.capabilities.map((capability) => (
                <tr key={`${ext.extension}:${capability.id}`}>
                  <td>
                    {capability.label}
                    {capability.description && <small className="muted block">{capability.description}</small>}
                  </td>
                  <td className="muted">{ext.extension}</td>
                  <td>
                    <span className="badge ok">{X.yes}</span>
                  </td>
                </tr>
              )),
            )}
            {caps?.have.flatMap((ext) =>
              ext.unavailable.map((capability) => (
                <tr key={`${ext.extension}:${capability.id}:off`}>
                  <td>
                    {capability.label}
                    <small className="warn-text block">{capability.reason}</small>
                  </td>
                  <td className="muted">{ext.extension}</td>
                  <td>
                    <span className="badge warn">{X.notOnThisComputer}</span>
                  </td>
                </tr>
              )),
            )}
            {caps?.missing.map((need) => {
              const offer = need.offers.find((candidate) => !candidate.installed);
              const entry = offer && entries?.find((candidate) => candidate.spec === offer.spec);
              return (
                <tr key={need.id}>
                  <td>
                    {need.label}
                    {need.description && <small className="muted block">{need.description}</small>}
                  </td>
                  <td className="muted">{need.offers.length ? `— (${need.offers.map((candidate) => candidate.name).join(", ")})` : `— (${X.notOffered})`}</td>
                  <td>
                    {entry && (
                      <button type="button" className="btn small" disabled={chat.busy} onClick={() => onAdd(entry)}>
                        {X.addButton}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!caps && <p className="muted">{X.loading}</p>}
      </div>
      <p className="muted">{X.capsNote}</p>
    </>
  );
}

/** The subject's classroom, as the mockup's "Aulas" view: its card, or linking one. */
export function ClassroomView({ chat, info, X, onLink }: { chat: ChatState; info: Info; X: ExtTexts; onLink: () => void }) {
  const room = info.classroom;
  return (
    <div className="wrap">
      {room ? (
        <div className="grid g2">
          <div className="card">
            <h3>
              <span aria-hidden="true">🎓</span> Moodle · {hostOf(room.url)}
              <span className={`badge ${room.connected ? "ok" : "warn"}`}>{room.connected ? X.connectedBadge : X.offBadge}</span>
            </h3>
            <p>{X.moodleCourse(room.courseId)}</p>
            <p className="muted">{room.connected ? X.classroomConnected(hostOf(room.url), room.courseId) : X.classroomOff(hostOf(room.url), room.courseId)}</p>
            <div className="row">
              <a className="btn small" href={`${room.url.replace(/\/+$/, "")}/course/view.php?id=${room.courseId}`} target="_blank" rel="noreferrer">
                Moodle ↗
              </a>
              {!room.connected && (
                <button type="button" className="btn small primary" disabled={chat.busy} onClick={onLink}>
                  {X.classroomReconnect}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p>{X.classroomNone}</p>
          <div className="row">
            <button type="button" className="btn primary" disabled={chat.busy} onClick={onLink}>
              {X.linkButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Linking a classroom in three steps, as the mockup's wizard: the course's address; what happens
 * (moodle-teacher installed and given this course, the sign-in later in the campus's own window);
 * done. The session opens again with the classroom.
 */
export function LinkWizard({ info, busy, X, onClose, onNotice }: { info: Info; busy: boolean; X: ExtTexts; onClose: () => void; onNotice: Notice }) {
  const room = info.classroom;
  const [step, setStep] = useState(room ? 2 : 1);
  const [url, setUrl] = useState(room ? `${room.url}/course/view.php?id=${room.courseId}` : "");
  const [course, setCourse] = useState(room?.courseId ?? "");
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState("");
  const idInUrl = /[?&]id=\d+/.test(url);
  const link = async () => {
    setError("");
    setLinking(true);
    const result = await act("classroom", { url, courseId: course }).catch((failure: unknown) => ({ error: String((failure as Error)?.message ?? failure) }));
    setLinking(false);
    if (result.error === "invalid") {
      setError(X.classroomInvalid);
      setStep(1);
    } else if (result.error) setError(result.error === "busy" ? X.busy : X.failed(result.error));
    else setStep(3);
  };
  const course3 = /[?&]id=(\d+)/.exec(url)?.[1] ?? course;
  return (
    <Dialog title={X.linkTitle} onEscape={linking ? undefined : onClose}>
      <div className="steps" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= step ? "on" : ""} />
        ))}
      </div>
      {step === 1 && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (url.trim() && (idInUrl || course.trim())) setStep(2);
          }}
        >
          <label className="lb">{X.linkKind}</label>
          <div className="chips">
            <span className="chip on">🎓 Moodle</span>
          </div>
          <label className="lb" htmlFor="link-url">
            {X.classroomUrl}
          </label>
          <input id="link-url" className="field" type="url" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://campus…/course/view.php?id=…" required data-autofocus />
          <p className="muted small">{X.classroomUrlHelp}</p>
          {url && !idInUrl && (
            <>
              <label className="lb" htmlFor="link-course">
                {X.classroomCourse}
              </label>
              <input id="link-course" className="field" inputMode="numeric" value={course} onChange={(event) => setCourse(event.target.value)} required />
            </>
          )}
          {error && <p className="why">{error}</p>}
          <div className="acts">
            <button type="button" className="btn ghost" onClick={onClose}>
              {X.cancel}
            </button>
            <button type="submit" className="btn primary" disabled={!url.trim() || (!idInUrl && !course.trim())}>
              {X.next}
            </button>
          </div>
        </form>
      )}
      {step === 2 && (
        <>
          <p>
            <b>{hostOf(url)}</b> · {X.moodleCourse(course3)}
          </p>
          <p>{X.linkStep2}</p>
          <div className="card center">
            <span className="muted">🪟 {X.linkStep2Note}</span>
          </div>
          {error && <p className="why">{error}</p>}
          <div className="acts">
            <button type="button" className="btn ghost" disabled={linking} onClick={() => setStep(1)}>
              {X.cancel}
            </button>
            <button type="button" className="btn primary" disabled={linking || busy} onClick={() => void link()} data-autofocus>
              {linking ? X.classroomConnecting : X.link}
            </button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <p>✅ {X.linked(hostOf(url), course3)}</p>
          <p className="muted">{X.linkedNote}</p>
          <div className="acts">
            <button
              type="button"
              className="btn primary"
              data-autofocus
              onClick={() => {
                onNotice(X.classroomDone);
                onClose();
              }}
            >
              {X.done}
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
