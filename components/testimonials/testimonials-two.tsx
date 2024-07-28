import { Card, CardHeader, CardContent } from '@/components/ui/card-header';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { testimonials } from '@/config/testimonials';

export default function TestimonialsTwo() {
  const groupedTestimonials = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    groupedTestimonials.push(testimonials.slice(i, i + 3));
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-primary sm:text-4xl">
            Loved by businesses worldwide.
          </h2>
          <p className="mt-4 text-lg leading-6 text-muted-foreground">
            Our software is so simple that people can't help but fall in love
            with it. Simplicity is easy when you just skip tons of
            mission-critical features.
          </p>
        </div>
        <div className="flex flex-wrap w-full max-w-7xl">
          {groupedTestimonials.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="flex flex-col w-full md:w-1/3 p-3 h-fit"
            >
              {group.map((testimonial, index) => (
                <Card
                  key={index}
                  className="mb-4 h-full flex flex-col justify-between"
                >
                  <CardContent className="p-4 text-2xs">
                    <p className="text-lg text-primary">{testimonial.text}</p>
                  </CardContent>
                  <Separator className="mt-4" />
                  <CardHeader className="flex flex-row items-center justify-between bg-zinc-100 dark:bg-zinc-800 p-2 rounded-b-xl">
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-primary">
                        {testimonial.name}
                      </h3>
                      <p className="text-base text-sm text-muted-foreground">
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
          ))}
        </div>
      </div>
    </div>
  );
}
