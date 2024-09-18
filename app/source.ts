import { map } from '@/.map';
import { createMDXSource, defaultSchemas } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { z } from 'zod';

export const { getPage, getPages, pageTree } = loader({
  baseUrl: '/docs',
  rootDir: 'docs',
  source: createMDXSource(map),
  icon(icon) {
    if (!icon) {
      return;
    }
    if (icon in icons) {
      return createElement(
        'div',
        { key: icon, className: 'flex justify-center items-center p-2' },
        createElement(
          'div',
          {
            className:
              'flex justify-center items-center w-7 h-7 rounded-md border'
          },
          createElement(icons[icon as keyof typeof icons], {
            className: 'w-7 h-7'
          })
        )
      );
    }
  }
});

export const blog = loader({
  baseUrl: '/blog',
  rootDir: 'blog',
  source: createMDXSource(map, {
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        author: z.string(),
        date: z.string().date().or(z.date()).optional()
      })
    }
  })
});

export type Page = InferPageType<typeof blog>;
export type Meta = InferMetaType<typeof blog>;
