// Unit tests of students' names in the page (#109), on the built code in dist/: a throwaway
// pseudonym directory (PSEUDONYM_HOME, plain storage, so no key), read through pseudonym's CLI as
// the host does, with aliases turned into names for the page and names into aliases for the agent.
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";

const home = await mkdtemp(path.join(os.tmpdir(), "miyagi-names-"));
process.env.PSEUDONYM_HOME = home;
process.env.PSEUDONYM_STORAGE = "plain";
after(() => rm(home, { recursive: true, force: true }));

const { remember } = await import("@falkenslab/pseudonym");
const { classroomNames, NO_NAMES } = await import("../dist/host/names.js");

const service = "moodle@localhost:8080";
const [lucia, ana, anaMaria] = await remember([
  { service, identifiers: { serviceUserId: "11" }, displayName: "Lucía Martín" },
  { service, identifiers: { serviceUserId: "12" }, displayName: "Ana López" },
  { service, identifiers: { serviceUserId: "13" }, displayName: "Ana María López" },
]);
// Someone of another site: never named in this classroom.
const [other] = await remember([{ service: "moodle@otro.example", identifiers: { serviceUserId: "11" }, displayName: "Pedro Ruiz" }]);

/** The classroom's names once the directory has been read. */
async function loaded() {
  let names;
  await new Promise((resolve) => (names = classroomNames("http://localhost:8080", resolve)));
  return names;
}

test("aliases become names for the page, and the approval says both", async () => {
  const names = await loaded();
  assert.equal(names.available, true);
  const state = { chat: { transcript: [{ kind: "agent", text: `${lucia}: 6,5. ${other}: sin entregar.` }], todos: null, turns: 3 } };
  const shown = names.reveal(state);
  assert.equal(shown.chat.transcript[0].text, `Lucía Martín: 6,5. ${other}: sin entregar.`);
  assert.equal(shown.chat.turns, 3);
  // The original stays with aliases: it's what the agent and the session's files keep.
  assert.equal(state.chat.transcript[0].text, `${lucia}: 6,5. ${other}: sin entregar.`);
  assert.equal(names.reveal(`Nota de ${lucia}`, true), `Nota de Lucía Martín (${lucia})`);
});

test("a name the teacher writes goes to the agent as its alias", async () => {
  const names = await loaded();
  const sent = names.aliasify({ line: "¿Cómo va LUCIA MARTIN? Y Ana María López, ¿entregó?", launch: { form: { alumno: "ana lópez" } } });
  assert.equal(sent.line, `¿Cómo va ${lucia}? Y ${anaMaria}, ¿entregó?`);
  assert.equal(sent.launch.form.alumno, ana);
  // Only whole names: a word that contains one is left alone, and so is someone of another site.
  assert.equal(names.aliasify("Lucía Martínez y Pedro Ruiz"), "Lucía Martínez y Pedro Ruiz");
});

test("the switch shows aliases until it's turned back", async () => {
  const names = await loaded();
  names.shown = false;
  assert.equal(names.reveal(`Nota de ${lucia}`), `Nota de ${lucia}`);
  // What the teacher writes still goes as an alias.
  assert.equal(names.aliasify("Lucía Martín"), lucia);
  names.shown = true;
  assert.equal(names.reveal(lucia), "Lucía Martín");
});

test("without a classroom nothing changes", () => {
  assert.equal(NO_NAMES.available, false);
  assert.equal(NO_NAMES.reveal(lucia), lucia);
  assert.equal(NO_NAMES.aliasify("Lucía Martín"), "Lucía Martín");
  assert.equal(classroomNames("no es una dirección", () => {}), NO_NAMES);
});
