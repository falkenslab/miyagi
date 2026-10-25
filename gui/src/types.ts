// The chat's state as the host sends it: agent-kit's ChatState (chat/chatController.d.ts), the
// fields this page draws. Plain data over server-sent events; the page never changes it, only
// sends actions back.

export type Mode = "interactive" | "guided" | "autonomous" | "plan";

export interface TranscriptCall {
  id?: string;
  toolName: string;
  label: string;
  result: { isError: boolean; text: string } | null;
  children: string[];
}

export type TranscriptEntry =
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "agent"; text: string }
  | { id: number; kind: "tools"; calls: TranscriptCall[] }
  | { id: number; kind: "notice"; tone: "plain" | "dim" | "warn" | "error"; text: string }
  | { id: number; kind: "turn-summary"; seconds: number };

export interface ApprovalPrompt {
  title: string;
  lines: string[];
  question?: string;
  markdown?: boolean;
}

export interface FormField {
  key: string;
  title: string;
  description?: string;
  type: "string" | "number" | "integer" | "boolean";
  options?: { value: string; label: string }[];
  multiple?: boolean;
  required: boolean;
  default?: string | number | boolean | string[];
  minimum?: number;
  maximum?: number;
}

export type ChatPanel =
  | { id: number; kind: "decision" | "manual" | "text"; prompt: ApprovalPrompt }
  | { id: number; kind: "choice"; prompt: ApprovalPrompt; choice: { options: readonly string[]; multiple: boolean } }
  | { id: number; kind: "form"; prompt: ApprovalPrompt; form: { server: string; message: string; fields: FormField[] } };

export interface Todo {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
}

export interface RunFolder {
  dir: string;
  title?: string;
}

export interface ChatState {
  transcript: TranscriptEntry[];
  busy: boolean;
  turnStartedAt: number | null;
  activity: string | null;
  todos: Todo[] | null;
  mode: Mode | null;
  switchableModes: readonly Mode[];
  turns: number;
  contextPercent: number | null;
  suggestion: string | null;
  commandDetails: { name: string; description: string; argumentHint: string }[];
  language: string;
  history: string[];
  panel: ChatPanel | null;
  choice: { title: string; options: { label: string; value: string }[] } | null;
  run: RunFolder | null;
  closed: boolean;
  extensions: PageExtensions | null;
}

/** The extensions part of the state, as the host gives it to the page: no paths, no option values. */
export interface PageExtensions {
  /** The subject's own extensions not trusted on this computer yet. */
  untrusted: { name: string; version?: string }[];
  installed: InstalledExtension[];
  /** The names of those running in this session. */
  active: string[];
  /** Those that can't run, with why. */
  inactive: { name: string; reason: string }[];
}

export interface InstalledExtension {
  name: string;
  scope: "agent" | "project";
  enabled: boolean;
  version: string | null;
  description: string;
  marketplace: string | null;
}

export interface Capability {
  id: string;
  label: string;
  description: string;
}

/** What miyagi can do now and what it lacks (the host's `capabilities`). */
export interface Capabilities {
  have: { extension: string; capabilities: Capability[]; unavailable: { id: string; label: string; reason: string }[] }[];
  missing: { id: string; skills: string[]; label: string; description: string; offers: { spec: string; name: string; label: string; description: string; installed: boolean }[] }[];
  /** The extension a classroom goes through. */
  classroomExtension: string;
}

export interface CatalogEntry {
  spec: string;
  name: string;
  marketplace: string;
  official: boolean;
  version: string | null;
  description: string;
  installed: boolean;
  update: boolean;
  capabilities: Capability[];
  requirements: { name: string; for: string[] }[];
  remote: string[];
  logo: boolean;
}

export interface ExtensionOptionState {
  key: string;
  option: {
    type: "string" | "number" | "boolean" | "directory" | "file";
    title: string;
    description: string;
    required?: boolean;
    sensitive?: boolean;
    options?: (string | number)[];
    multiple?: boolean;
  };
  /** Never there for a sensitive one. */
  value?: string | number | boolean | string[];
  set: boolean;
  isDefault: boolean;
}

export interface Repository {
  name: string;
  source: string;
  official: boolean;
  updated: string;
  owner: string | null;
  description: string | null;
  extensions: number | null;
}

export interface Info {
  name: string;
  version: string;
  kit: string;
  language: string;
  /** The subject open, by its name; null when none is (the page shows the list). */
  workspace: string | null;
  /** The subject's Moodle course, and whether moodle-teacher reaches it now; null without one. */
  classroom: { url: string; courseId: string; connected: boolean } | null;
}

export interface HostState {
  signedIn: boolean;
  chat: ChatState | null;
  /** A subject is opening: its chat isn't ready yet. */
  opening: boolean;
}

/** A subject in the registry (~/.miyagi/workspaces.json). */
export interface Subject {
  id: string;
  name: string;
  kind: string;
  dir: string;
  openedAt: string;
  missing: boolean;
}
