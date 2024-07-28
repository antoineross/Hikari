import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { marked } from 'marked';

export const InfoTooltip = ({ markdownText }: { markdownText: string }) => {
  const htmlContent = marked(markdownText);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="text-primary cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent
          side="bottom" // This makes the tooltip appear below the trigger
          align="start" // Adjusts the alignment of the tooltip
          className="bg-background p-2 shadow-lg rounded-lg z-50" // Ensure tooltip appears on top
        >
          <div
            className="prose p-3 text-primary text-sm"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
