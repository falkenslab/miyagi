// The startup tips' window (#82). The tips themselves are in gui/tips/ (es and en; fr and de fall back to en).

export interface TipsTexts {
  /** Its name in the rail's menu. */
  name: string;
  previous: string;
  next: string;
  close: string;
  learnMore: string;
  dontShow: string;
  /** "Tip 3 of 50". */
  count: (n: number, total: number) => string;
}

const es: TipsTexts = {
  name: "Trucos",
  previous: "Anterior",
  next: "Siguiente truco",
  close: "Cerrar",
  learnMore: "Más información",
  dontShow: "No mostrar trucos al abrir",
  count: (n, total) => `Truco ${n} de ${total}`,
};

const en: TipsTexts = {
  name: "Tips",
  previous: "Previous",
  next: "Next tip",
  close: "Close",
  learnMore: "Learn more",
  dontShow: "Don't show tips on startup",
  count: (n, total) => `Tip ${n} of ${total}`,
};

const fr: TipsTexts = {
  name: "Astuces",
  previous: "Précédente",
  next: "Astuce suivante",
  close: "Fermer",
  learnMore: "En savoir plus",
  dontShow: "Ne pas afficher les astuces au démarrage",
  count: (n, total) => `Astuce ${n} sur ${total}`,
};

const de: TipsTexts = {
  name: "Tipps",
  previous: "Zurück",
  next: "Nächster Tipp",
  close: "Schließen",
  learnMore: "Mehr erfahren",
  dontShow: "Beim Start keine Tipps anzeigen",
  count: (n, total) => `Tipp ${n} von ${total}`,
};

const ALL: Record<string, TipsTexts> = { es, en, fr, de };

/** The window's texts for a language code, as `texts()` picks the chat's. */
export function tipsTexts(language: string | undefined): TipsTexts {
  return ALL[(language ?? "en").slice(0, 2).toLowerCase()] ?? en;
}
