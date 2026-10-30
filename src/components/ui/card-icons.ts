import { Apple, BarChart3, Boxes, Brain, ClipboardCheck, Cloud, Code2, Cpu, Gamepad2, Globe, Handshake, Layers, Lightbulb, Link2, Monitor, PenTool, ShieldCheck, ShoppingCart, Smartphone, Sparkles, Workflow, Wrench, type LucideIcon } from 'lucide-react';

/** Picks an icon for a card from its title when the content carries no icon name. Order matters: first match wins. */
const RULES: [RegExp, LucideIcon][] = [
  [/android/i, Smartphone],
  [/\bios\b|iphone|swift/i, Apple],
  [/windows|desktop/i, Monitor],
  [/mobile|app\b/i, Smartphone],
  [/cloud|aws|azure/i, Cloud],
  [/web|website|internet/i, Globe],
  [/insight|idea|innovation/i, Lightbulb],
  [/\bai\b|machine|learning|intelligen|chatbot/i, Brain],
  [/data|analytic|report/i, BarChart3],
  [/secur|cyber|privacy/i, ShieldCheck],
  [/commerce|shop|retail|store/i, ShoppingCart],
  [/iot|embedded|device/i, Cpu],
  [/blockchain/i, Link2],
  [/erp|crm|enterprise/i, Boxes],
  [/test|qa|quality/i, ClipboardCheck],
  [/design|ui|ux/i, PenTool],
  [/devops|automation|workflow|process/i, Workflow],
  [/saas|platform/i, Layers],
  [/game/i, Gamepad2],
  [/consult|partner|team/i, Handshake],
  [/support|maintenan/i, Wrench],
  [/software|custom|develop|engineer|code/i, Code2],
];

export function iconForTitle(title: string): LucideIcon {
  for (const [re, icon] of RULES) if (re.test(title)) return icon;
  return Sparkles;
}

/** Colourful tile backgrounds, cycled by card position. */
export const TILE_GRADIENTS = [
  'from-emerald-400 to-teal-600',
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-orange-400 to-rose-500',
  'from-amber-300 to-orange-500',
  'from-pink-400 to-fuchsia-600',
  'from-lime-400 to-green-600',
  'from-cyan-400 to-indigo-500',
];
