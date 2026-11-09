// The line icons of the chat's frame (#60), inline so they follow the text's color in both themes.

const paths = {
  menu: "M4 7h16M4 12h16M4 17h16",
  edit: "M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6 M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
  plus: "M12 5v14M5 12h14",
  down: "M6 9l6 6 6-6",
  up: "M6 15l6-6 6 6",
  right: "M9 6l6 6-6 6",
  left: "M15 6l-6 6 6 6",
  x: "M6 6l12 12M18 6L6 18",
  side: "M4 5h16v14H4z M15 5v14",
  expand: "M9 4H4v5 M15 4h5v5 M9 20H4v-5 M15 20h5v-5",
  shrink: "M9 4v5H4 M15 4v5h5 M9 20v-5H4 M15 20v-5h5",
  send: "M12 19V5M5 12l7-7 7 7",
  toEnd: "M12 5v14M5 12l7 7 7-7",
  copy: "M9 9h10v10H9z M5 15V5h10",
  check: "M5 12l5 5 9-10",
  clip: "M21 11.5l-8.5 8.5a5 5 0 0 1-7-7L14 4.5a3.3 3.3 0 0 1 4.7 4.7L10.2 17.7a1.7 1.7 0 0 1-2.4-2.4L15.5 7.6",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  forum: "M4 5h16v11H9l-5 4z",
  folder: "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
  classroom: "M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5",
  panel: "M4 5h16v14H4z M9 5v14",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
  bell: "M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z M10 21a2 2 0 0 0 4 0",
  pin: "M9 4h6l-1 6 3 4H7l3-4z M12 14v7",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="icon">
      <path d={paths[name]} />
    </svg>
  );
}
