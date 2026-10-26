// miyagi's documentation site, published to https://falkenslab.github.io/miyagi/ by
// .github/workflows/pages.yml. In Spanish (the default locale) and English, under /en/ (#28): the
// English pages are in i18n/en/, and a page that isn't there (the SQL tutorial's) is served in Spanish.
import fs from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";

const repo = "https://github.com/falkenslab/miyagi";

// What changes per language besides the translated pages: the tagline, the description and the
// social preview image (the build runs once per locale).
const english = process.env.DOCUSAURUS_CURRENT_LOCALE === "en";
const site = english
  ? {
      tagline: "You teach, and miyagi takes care of the rest",
      description: "miyagi goes into your Moodle course with your teacher account: it grades with your rubric, looks after the forum, builds units, quizzes and games, writes your teaching plan and tells you how the class is doing. Nothing reaches your students without your permission.",
      image: "img/og-en.png",
    }
  : {
      tagline: "Tú enseñas, y miyagi se ocupa del resto",
      description: "miyagi entra en tu curso de Moodle con tu cuenta de profesor: corrige con tu rúbrica, atiende el foro, monta temas, cuestionarios y juegos, escribe tu programación y te dice cómo va la clase. Nada llega a tus alumnos sin tu permiso.",
      image: "img/og-es.png",
    };

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "miyagi",
  tagline: site.tagline,
  favicon: "img/miyagi.svg",
  url: "https://falkenslab.github.io",
  baseUrl: "/miyagi/",
  organizationName: "falkenslab",
  projectName: "miyagi",
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: { hooks: { onBrokenMarkdownLinks: "throw" } },
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    localeConfigs: { es: { label: "Español", htmlLang: "es" }, en: { label: "English", htmlLang: "en" } },
  },

  // The fonts as static files, their @font-face rules inline in the head (no extra stylesheet to
  // wait for) and font-display: optional, since the LCP of most pages is text.
  headTags: [
    { tagName: "style", attributes: {}, innerHTML: fs.readFileSync(new URL("./static/fonts/fonts.css", import.meta.url), "utf8").replace(/url\("\.\//g, 'url("/miyagi/fonts/') },
  ],

  // The bundle starts once the page has loaded, not during its first paint (#27).
  plugins: ["./plugins/deferred-hydration.js"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "content",
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          editUrl: `${repo}/edit/main/docs/`,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: site.image,
      metadata: [
        { name: "description", content: site.description },
        { name: "theme-color", content: "#18181b" },
      ],
      colorMode: { respectPrefersColorScheme: true },
      navbar: {
        title: "miyagi",
        items: [
          { type: "docSidebar", sidebarId: "guia", label: "Guía", position: "left" },
          { type: "docSidebar", sidebarId: "casos", label: "Casos de uso", position: "left" },
          { type: "docSidebar", sidebarId: "avanzado", label: "Avanzado", position: "left" },
          { type: "localeDropdown", position: "right" },
          { href: repo, label: "GitHub", position: "right" },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Empezar",
            items: [
              { label: "Instalar", to: "/guia/instalar/" },
              { label: "Primeros pasos", to: "/guia/primeros-pasos/" },
              { label: "Preguntas frecuentes", to: "/guia/preguntas-frecuentes/" },
            ],
          },
          {
            title: "Aprender",
            items: [
              { label: "Aula de Introducción a SQL", to: "/casos-de-uso/" },
              { label: "Habilidades", to: "/guia/habilidades/" },
              { label: "Avanzado", to: "/avanzado/" },
            ],
          },
          {
            title: "Proyecto",
            items: [
              { label: "GitHub", href: repo },
              { label: "Última versión", href: `${repo}/releases/latest` },
              { label: "Hoja de ruta", to: "/hoja-de-ruta/" },
              { label: "Informes de pruebas", href: `${repo}/blob/main/tests/README.md` },
              { label: "Licencia MIT", href: `${repo}/blob/main/LICENSE` },
            ],
          },
        ],
        copyright: "miyagi, de falkenslab. Gratis y de código abierto.",
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.vsDark,
        additionalLanguages: ["bash", "powershell", "sql", "json", "yaml", "docker"],
      },
    }),
};

export default config;
