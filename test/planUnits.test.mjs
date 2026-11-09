// Unit tests of the teaching plan's units as the topics view reads them (#74), on the built code
// in dist/. Run with `npm test` after `npm run build`.
import assert from "node:assert/strict";
import { test } from "node:test";
import { planUnits } from "../dist/host/planUnits.js";

const plan = `# Programación didáctica

## 2. Objetivos

| Objetivo | RA | En pocas palabras |
| --- | --- | --- |
| O1 | RA1 | Reconoce los elementos de las BD |
| O2 | RA2 | Crea bases de datos |

## 3. Unidades y calendario

| UT | Título | Fechas | Horas aprox. | RA |
| --- | --- | --- | --- | --- |
| 1 | Sistemas de almacenamiento | 14 sep – 25 sep | 10 | RA1 |
| 2 | [Modelo E/R y E/R ampliado](topic/ut2-modelo-entidad-relacion) (tramo final en \`materials/ut2/\`) | 28 sep – **20 nov** | 38 | RA6 |
| 3 | **Modelo relacional** y normalización (3FN) | 23 nov – 22 dic | 20 | — |
| — | Recuperación de RA y cierre | 7 jun – 22 jun | 12 | — |
| | **Total** | | **≈80** | |
`;

test("every row with a number is a unit, in order, with its link and the rest of the row", () => {
  assert.deepEqual(planUnits(plan), [
    { number: "1", title: "Sistemas de almacenamiento", topic: null, details: "Fechas: 14 sep – 25 sep · Horas aprox.: 10 · RA: RA1" },
    { number: "2", title: "Modelo E/R y E/R ampliado", topic: "topic/ut2-modelo-entidad-relacion", details: "Fechas: 28 sep – 20 nov · Horas aprox.: 38 · RA: RA6" },
    { number: "3", title: "Modelo relacional y normalización (3FN)", topic: null, details: "Fechas: 23 nov – 22 dic · Horas aprox.: 20" },
  ]);
});

test("a link as the file path, units numbered UT1, and a plan without a units table", () => {
  const units = planUnits("| Unidad | Nombre |\n|---|---|\n| UT1 | [Intro](topics/intro.md) |\n| UT2 | Más |\n");
  assert.deepEqual(units.map((unit) => [unit.number, unit.title, unit.topic]), [["UT1", "Intro", "topic/intro"], ["UT2", "Más", null]]);
  assert.deepEqual(planUnits("# Plan\n\nSin tabla de unidades.\n"), []);
});

test("units listed as bullet points win over another section's table that starts with a topic", () => {
  const units = planUnits(`# Programación

## 4. Temas

- [Tema 1. MariaDB en Docker](topics/tema-1-mariadb-docker.md), semana 1: O1.
- [Tema 2. DDL](topics/tema-2-ddl.md), semanas 2 y 3: O2.

## 8. Atención a la diversidad

| Tema | Refuerzo | Ampliación |
| --- | --- | --- |
| T1 | Guía paso a paso | Eliminar el contenedor |
| T2 | Esquema parcial | Una tabla nueva |
`);
  assert.deepEqual(units.map((unit) => [unit.number, unit.title, unit.topic]), [
    ["1", "MariaDB en Docker", "topic/tema-1-mariadb-docker"],
    ["2", "DDL", "topic/tema-2-ddl"],
  ]);
  assert.equal(units[0].details, "semana 1: O1.");
});

test("with a section on the units, a table elsewhere isn't taken for them", () => {
  assert.deepEqual(planUnits(`## Temas

Por definir.

## Diversidad

| Tema | Refuerzo | Ampliación |
| --- | --- | --- |
| T1 | A | B |
| T2 | C | D |
`), []);
});
