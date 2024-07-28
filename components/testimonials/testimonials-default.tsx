import { Card, CardHeader, CardContent } from '@/components/ui/card-header';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { testimonials } from '@/config/testimonials';

export default function Testimonials() {
  const groupedTestimonials = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    groupedTestimonials.push(testimonials.slice(i, i + 3));
  }

  return (
    <div className="relative flex flex-col items-center justify-center max-w-5xl p-4 mx-auto">
      <div className="flex items-center w-full max-w-7xl mb-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <div className="flex-shrink px-2 text-center">
          <h2 className="text-3xl font-bold">Testimonials</h2>
          <p className="text-muted-foreground">
            Don't take my word, take everyone else's
          </p>
        </div>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="flex flex-wrap w-full max-w-7xl">
        {groupedTestimonials.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex flex-col w-full md:w-1/3 p-2 h-fit"
          >
            {group.map((testimonial, index) => (
              <Card key={index} className="mb-4 h-full">
                <CardHeader className="flex flex-row items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-t-xl">
                  <Avatar>
                    <AvatarImage src={testimonial.avatarImg} />
                    <AvatarFallback>
                      {testimonial.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.title}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 text-xs">
                  <p>{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
