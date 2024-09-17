'use client';

import { useState } from 'react';
import { faqItems } from '@/config/faq';

export default function FAQSection() {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto p-6 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <p className="text-muted-foreground">
          You got questions? I got answers.
        </p>
      </div>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div
              className={`flex items-center justify-between p-4 cursor-pointer ${activeItem === index ? 'bg-muted' : ''}`}
              onClick={() => toggleItem(index)}
            >
              <span>{item.question}</span>
              <ArrowDownLeftIcon
                className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ease-in-out ${activeItem === index ? 'rotate-45' : ''}`}
              />
              {/* 
              <CrossIcon
              className={`h-5 w-5 text-muted-foreground transition-transform ${activeItem === index ? "rotate-90" : ""}`}
              /> 
              */}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                activeItem === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 border-t border-zinc-200 text-sm">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArrowDownLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 7 7 17" />
      <path d="M17 17H7V7" />
    </svg>
  );
}

function CrossIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  );
}
