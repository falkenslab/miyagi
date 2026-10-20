import path from "node:path";
import { extensionOptionStates } from "@falkenslab/agent-kit";
import { enabledExtensions } from "./extensions.js";
import { slugify } from "./workspaces.js";

/**
 * Practical activities checked by running them, through the docker-lab extension (#45): docker-mcp's
 * labs, each a folder with its compose.yaml (and lab.json with its check), run under a policy its
 * server enforces (no internet unless allowed, nothing mounted outside the lab, never the Docker
 * socket, CPU and memory limits). miyagi has no shell of its own.
 */
export const DOCKER_LAB = "docker-lab";

/** Its local server is `docker` in its `.mcp.json`: the session names its tools `mcp__docker__<tool>`. */
const DOCKER_TOOLS = "mcp__docker__";

/**
 * docker-mcp's tools on the computer's whole Docker (containers, images, volumes, networks,
 * Compose projects, prune): never miyagi's, whatever the extension's mode. Only the labs, under
 * their policy, are a teaching assistant's.
 */
const NEVER_DOCKER_TOOLS = [
  "list_containers", "inspect_container", "container_logs", "container_stats", "container_processes",
  "run_container", "start_container", "stop_container", "restart_container", "remove_container",
  "exec_in_container", "copy_to_container", "copy_from_container",
  "list_images", "inspect_image", "pull_image", "build_image", "tag_image", "push_image", "remove_image",
  "compose_ps", "compose_logs", "compose_build", "compose_up", "compose_down", "compose_exec",
  "disk_usage", "prune", "list_volumes", "inspect_volume", "create_volume", "remove_volume",
  "list_networks", "inspect_network", "create_network", "remove_network",
];

export const NEVER_DOCKER_TOOL_NAMES = NEVER_DOCKER_TOOLS.map((tool) => `${DOCKER_TOOLS}${tool}`);

/**
 * The labs folder of the docker-lab this workspace's sessions run, when it's installed and on: its
 * `labs_dir` option, or `labs` in its data folder (docker-mcp's default). The agent writes each
 * lab's files there, so the session makes it writable; docker-mcp has no tool to write them.
 */
export async function dockerLabsDir(workspaceDir: string): Promise<string | undefined> {
  const lab = (await enabledExtensions(workspaceDir)).find((ext) => ext.name === DOCKER_LAB);
  if (!lab) return undefined;
  const option = (await extensionOptionStates(lab)).find((state) => state.key === "labs_dir")?.value;
  return typeof option === "string" && option.trim() ? path.resolve(option) : path.join(lab.dataDir, "labs");
}

/** This subject's labs, when docker-lab is on: its labs folder and a prefix (the subject's slug) so subjects don't share a lab. */
export async function labsFor(workspaceDir: string, label: string): Promise<{ dir: string; prefix: string } | undefined> {
  const dir = await dockerLabsDir(workspaceDir);
  return dir ? { dir, prefix: slugify(label) } : undefined;
}
