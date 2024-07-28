import { features } from '@/config/features';

export default function Features() {
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
          This project is an experiment to see how a modern app, with features
          like auth, subscriptions, API routes, and static pages would work in
          Next.js 13 app dir.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map((feature) => (
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg
                viewBox="0 0 24 24"
                className="h-12 w-12 fill-current"
                fill-rule={feature.fillRule}
              >
                <path d={feature.svgPath} />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto text-center md:max-w-[58rem]">
        <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Taxonomy also includes a blog and a full-featured documentation site
          built using Contentlayer and MDX.
        </p>
      </div>
    </section>
  );
}
