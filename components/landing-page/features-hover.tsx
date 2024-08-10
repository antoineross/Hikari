'use client';

import { features } from '@/config/features';
import { motion } from 'framer-motion';
import React from 'react';

export default function FeaturesHover() {
  return (
    <section
      id="features"
      className="container space-y-6 bg-zinc-50 py-8 dark:bg-zinc-900 md:py-12 lg:py-24 rounded-6xl mb-10"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          This project is a complete assortment of the best open source projects
          that can be used for SaaS products. Built with Nextjs14 and Supabase
          using the app router.
        </p>
      </div>
      <div className="mx-auto grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 md:max-w-[64rem]">
        {features.map((feature) => (
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', bounce: 0.7 }}
            key={feature.title}
            className="relative overflow-hidden rounded-lg border bg-background dark:bg-zinc-950 p-6"
          >
            <a target="_blank" rel="noopener noreferrer" href={feature.link}>
              <svg
                viewBox="0 0 24 24"
                className="h-12 w-12 fill-current mb-4"
                fill-rule={feature.fillRule}
              >
                <path d={feature.svgPath} />
              </svg>
              <div className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {feature.title}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-500">
                {feature.description}
              </div>
            </a>
          </motion.div>
        ))}
      </div>
      <div className="mx-auto text-center md:max-w-[58rem]">
        {/* <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Hikari also includes a blog and a full-featured documentation site
          built using Fumadocs and MDX.
        </p> */}
      </div>
    </section>
  );
}
