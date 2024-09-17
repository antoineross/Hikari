import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Eclipse, Github } from 'lucide-react';

export default function FooterBlog() {
  return (
    <footer className="py-10 w-full">
      <Separator className="mb-8 w-4/5 mx-auto" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row justify-between">
          <div className="flex items-center space-x-2">
            <Icons.Eclipse className="h-6 w-6" />
            <span className="text-xl font-bold">Hikari.</span>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                Built with ❤️ by{' '}
                <a
                  href="https://x.com/antoineross__"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Antoine
                </a>
              </p>
              <a
                href="https://github.com/antoineross/hikari"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/antoineross__"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Note: Some blog content is AI-assisted. As the developer is
              working solo, there may be occasional oversights. Please verify
              important information.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
