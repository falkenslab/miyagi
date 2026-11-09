// Unit tests of the watch on a conversation's start (#88), on the built code in dist/. Run with
// `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";
import { watchStart } from "../dist/host/startWatch.js";

function chat(state) {
  const listeners = new Set();
  return {
    state,
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(change) {
      Object.assign(state, change);
      for (const listener of listeners) listener();
    },
  };
}
const starting = () => ({ busy: true, transcript: [], panel: null, choice: null });

test("a start that never ends is reported once", async () => {
  let stuck = 0;
  const stop = watchStart(chat(starting()), () => stuck++, 10);
  await sleep(40);
  assert.equal(stuck, 1);
  stop();
});

test("a start that gets a message, or a question for the teacher, isn't stuck", async () => {
  for (const change of [{ transcript: [{}] }, { panel: {} }, { choice: {} }, { busy: false }]) {
    let stuck = 0;
    const watched = chat(starting());
    const stop = watchStart(watched, () => stuck++, 20);
    watched.set(change);
    await sleep(40);
    assert.equal(stuck, 0, JSON.stringify(change));
    stop();
  }
});

test("a new start after an answered one is watched again", async () => {
  let stuck = 0;
  const watched = chat(starting());
  const stop = watchStart(watched, () => stuck++, 20);
  watched.set({ busy: false });
  watched.set({ busy: true, transcript: [] });
  await sleep(40);
  assert.equal(stuck, 1);
  stop();
});
