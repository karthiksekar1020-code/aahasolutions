/** Structured content stored in ContentPage.sections (extracted from the legacy site, editable in admin). */
export type Block =
  | { t: 'p'; html: string }
  | { t: 'ul'; items: string[] }
  | { t: 'card'; title: string; text: string; icon?: string }
  | { t: 'img'; src: string; alt: string }
  | { t: 'tabs'; tabs: { label: string; title?: string; paras?: string[]; img?: { src: string; alt: string }; video?: { src: string; poster?: string } }[]; side?: { src: string; alt: string; video?: string } }
  | { t: 'cta'; label: string; href: string };

export interface Section {
  heading: string | null;
  blocks: Block[];
}

export interface FaqItem {
  q: string;
  a: string;
}
