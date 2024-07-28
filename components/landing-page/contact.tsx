import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <div className="max-w-[90vw] bg-slate-50 dark:bg-transparent text-primary rounded-6xl p-12 md:p-16 mx-auto mb-12">
      <div className="max-w-[50vw] p-16 ml-20">
        <div className="my-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Tell us about your project
          </h2>
          <Button className="bg-primary text-secondary rounded-full px-6 py-2">
            Say Hej
          </Button>
        </div>
        <hr className="border-t border-gray-700 my-10" />
        <div className="my-4">
          <h3 className="text-xl font-semibold mb-2">Our offices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Copenhagen</h4>
                <p className="font-light">1 Carlsberg Gate</p>
                <p className="font-light">1260, København, Denmark</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold">Billund</h4>
                <p className="font-light">24 Lego Allé</p>
                <p className="font-light">7190, Billund, Denmark</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
