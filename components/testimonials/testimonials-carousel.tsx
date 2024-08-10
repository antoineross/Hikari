'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const testimonials = [
  {
    name: 'dcodesdev',
    title: 'TypeScript Developer',
    avatarFallback: 'DC',
    avatarImg: '/images/dcodes.png',
    text: "That's beautiful bro!"
  },
  {
    name: 'SuhailKakar',
    title: 'Developer at joinOnboard',
    avatarFallback: 'SK',
    avatarImg: '/images/SuhailKakar.jpg',
    text: "If you've built this a few months ago, it would have saved me hours :D"
  },
  {
    name: 'SaidAitmbarek',
    title: 'Founder of microlaunch.net',
    avatarFallback: 'SA',
    avatarImg: '/images/said.jpg',
    text: "So cool, looks really clean. Any plan to open source it? ☺️ Wanna play with it!"
  },
  {
    name: 'magicuidesign',
    title: 'UI Design Company',
    avatarFallback: 'MU',
    avatarImg: '/images/magicui.jpg',
    text: "Clean 🤌"
  },
  {
    name: 'YasmeenRoumie',
    title: 'Developer',
    avatarFallback: 'YR',
    avatarImg: '/images/yasmeen.jpg',
    text: "Ooh would love to try this out"
  },
  {
    name: 'shadcn',
    title: 'Developer',
    avatarFallback: 'SC',
    avatarImg: '/images/shadcn.jpg',
    text: "👀"
  },
  {
    name: 'MPlegas',
    title: 'Developer',
    avatarFallback: 'MP',
    avatarImg: '/images/MPlegas.jpg',
    text: "Exceptional!"
  },
  {
    name: '0xRaduan',
    title: 'Developer',
    avatarFallback: 'RA',
    avatarImg: '/images/0xraduan.jpg',
    text: "This looks fire"
  },
  {
    name: 'Luax0',
    title: 'Developer',
    avatarFallback: 'LX',
    avatarImg: '/images/luax0.jpg',
    text: "Can't wait to see more 👀"
  },
  {
    name: 'ausrobdev',
    title: 'Developer',
    avatarFallback: 'RA',
    avatarImg: '/images/robdev.jpg',
    text: "Let me know when its ready, I'll add it to buildatlightspeed.com - we need more high quality open source boilerplates"
  }
];

const TestimonialCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTestimonial(
        (prevTestimonial) => (prevTestimonial + 1) % testimonials.length,
      )
    }, 5000) // Change Time here

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const { name, title, avatarImg, text } = testimonials[currentTestimonial]

  const variants = {
    initial: { opacity: 0, y: '100%', scale: 0.1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: '100%', scale: 0.1 },
  }
  const dotVariants = {
    active: { scale: 1.2, backgroundColor: '#3f3f46' },
    inactive: { scale: 1, backgroundColor: '#D1D5DB' },
  }

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
          <div className="mt-10 flex justify-center">
            {testimonials.map((_, index) => (
              <motion.div
                key={index}
                className="mx-1.5 h-2 w-2 cursor-pointer rounded-full"
                variants={dotVariants}
                animate={index === currentTestimonial ? 'active' : 'inactive'}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default TestimonialCarousel