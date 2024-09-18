import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';
import { docsOptions } from '@/app/layout.config';
// import 'fumadocs-ui/style.css';
import { RootToggle } from 'fumadocs-ui/components/layout/root-toggle';
import { Icons } from '@/components/icons';
import { SunIcon } from '@heroicons/react/24/solid';
import 'fumadocs-ui/twoslash.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{
        title: (
          <>
            <SunIcon className="size-8 transition-transform duration-300 ease-in-out hover:scale-110" />
            <strong>Hikari</strong>
          </>
        ),
        url: '/'
      }}
      // sidebar={{
      //   banner: (
      //     <RootToggle
      //       options={[
      //         {
      //           title: 'Configure',
      //           icon: <Icons.Bolt />,
      //           description: 'Environment Variables',
      //           url: '/docs/configure',
      //         },
      //         {
      //           title: 'Components',
      //           icon: <Icons.Puzzle />,
      //           description: 'Landing Page Components',
      //           url: '/path/to/page-tree-2',
      //         },
      //       ]}
      //     />
      //   ),
      // }}
      {...docsOptions}
    >
      {children}
    </DocsLayout>
  );
}
