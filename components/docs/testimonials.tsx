'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/docs/card-header';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { testimonials } from '@/config/testimonials';

export const TestimonialCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTestimonial(
        (prevTestimonial) => (prevTestimonial + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const { name, title, avatarImg, text } = testimonials[currentTestimonial];

  const variants = {
    initial: { opacity: 0, y: '100%', scale: 0.1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: '100%', scale: 0.1 },
  };

  return (
    <section className="py-12 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentTestimonial}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className="flex w-full flex-col items-center justify-center"
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              duration: 0.5,
            }}
          >
            <img src={avatarImg} alt={name} className="m-0 size-20 rounded-full" />
            <p className="m-0 mt-4 text-center text-xl font-medium tracking-tight">
              &quot;{text}&quot;
            </p>
            <div className="mt-6">
              <div className="flex flex-col items-center justify-center">
                <div className="font-semibold text-base text-gray-900">{name}</div>
                <div className="font-medium text-sm text-gray-900/80">{title}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export const TestimonialsGrid = () => {
  const groupedTestimonials = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    groupedTestimonials.push(testimonials.slice(i, i + 3));
  }

  return (
    <div className="py-6">
      <div className="mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-primary">
            Loved by businesses worldwide
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Our software is so simple that people can't help but fall in love with it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between"
            >
              <CardContent className="p-4">
                <p className="text-sm text-primary">{testimonial.text}</p>
              </CardContent>
              <Separator />
              <CardHeader className="flex flex-row items-center justify-between bg-zinc-100 dark:bg-zinc-800 p-3 rounded-b-xl">
                <div>
                  <h3 className="text-sm font-medium text-primary">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.title}
                  </p>
                </div>
                <Avatar>
                  <AvatarImage src={testimonial.avatarImg} />
                  <AvatarFallback>
                    {testimonial.avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
