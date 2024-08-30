'use client';

import { features } from '@/config/features';
import { motion } from 'framer-motion';
import React from 'react';

export const Feature = () => (
  <div className="mx-auto grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 md:max-w-[64rem]">
    {features.map((feature) => (
      <div
        key={feature.title}
        className="relative overflow-hidden rounded-lg border bg-background dark:bg-zinc-950 p-6"
      >
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
      </div>
    ))}
  </div>
);

export const FeatureHover = () => (
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
);