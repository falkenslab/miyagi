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
}

export interface Info {
  name: string;
  version: string;
  kit: string;
  language: string;
  /** The subject open, by its name; null when none is (the page shows the list). */
  workspace: string | null;
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
