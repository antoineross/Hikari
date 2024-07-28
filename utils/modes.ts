/* eslint-disable import/no-relative-packages -- required */
import {
  LayoutIcon,
  LibraryIcon,
  PaperclipIcon,
  type LucideIcon
} from 'lucide-react';
import mdx from 'fumadocs-ui/mdx/package.json';
import ui from 'fumadocs-ui/ui/package.json';
import zeta from 'fumadocs-ui/core/package.json';

export interface Mode {
  param: string;
  name: string;
  package: string;
  description: string;
  version: string;
  icon: LucideIcon;
}

export const modes: Mode[] = [
  {
    param: 'headless',
    name: 'Core',
    package: 'fumadocs-core',
    description: 'The core library',
    version: zeta.version,
    icon: LibraryIcon
  },
  {
    param: 'ui',
    name: 'UI',
    package: 'fumadocs-ui',
    description: 'The user interface',
    version: ui.version,
    icon: LayoutIcon
  },
  {
    param: 'mdx',
    name: 'MDX',
    package: 'fumadocs-mdx',
    description: 'Built-in source provider',
    version: mdx.version,
    icon: PaperclipIcon
  }
];
