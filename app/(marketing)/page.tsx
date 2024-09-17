import Testimonials from '@/components/testimonials/testimonials-default';
import FAQSection from '@/components/landing-page/faq';
import Hero from '@/components/landing-page/hero';
import LogoCloud from '@/components/landing-page/logo-cloud-svg';
import FeaturesHover from '@/components/landing-page/features-hover';
import Pricing from '@/components/pricing/pricing-primary';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedBeamMultipleOutputDemo } from '@/components/animated-beam';
import { BentoDemo } from '@/components/landing-page/features-bento-grid';

export default async function IndexPage() {
  return (
      <div className="flex-col gap-10 mb-5">
        <Hero />
        <LogoCloud />
        <FeaturesHover />
        <Pricing />
        <Testimonials />
        <section className="my-16">
          <div className="flex items-center w-full mb-8">
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="text-3xl font-bold">Community highlights</h2>
              <Link href="https://x.com/antoineross__" target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500 hover:underline">
               Join the community
              </Link>
            </div>
          </div>
          <Link href="https://x.com/antoineross__/status/1812493114948600317" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full mx-auto">
            <Image src="/images/tweet.png" alt="Tweet by shadcn" width={550} height={300} />
          </Link>
        </section>
      <FAQSection />
    </div>
  );
}
