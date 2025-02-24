"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

export default function HuggingFaceDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Add dark class to html element
    document.documentElement.classList.add("dark");
    return () => {
      // Clean up by removing dark class when component unmounts
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-black pt-14 overflow-x-hidden dark:bg-gray-900">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-16 right-4 z-10 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={() => setOpen(true)}
            >
              <InfoIcon className="h-4 w-4" />
              <span className="sr-only">Page information</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="dark:bg-neutral-800 dark:text-neutral-200"
          >
            <p>Click for more information about this demo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:bg-neutral-900 dark:text-neutral-200">
          <DialogHeader>
            <DialogTitle className="dark:text-neutral-100 mb-2">
              About the Demo
            </DialogTitle>
            <DialogDescription className="dark:text-neutral-300">
              This demo shows our hardware accelerator in action. We have used
              the MNIST dataset to train a simple convolutional neural network
              to classify handwritten digits. The model is first run on our
              &ldquo;ground truth&rdquo; PyTorch implementation, then is run on
              our hardware simulator. You can experiment with different data
              types and multipliers to see how the hardware accelerator
              performs. Please be aware that the accelerator is not complete and
              the results are not representative of the final product.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <iframe
        src="https://justintchou-hardware-accelerators-demo.hf.space"
        className="w-full h-[1200px] border-none"
        title="Hugging Face Stable Diffusion Demo"
      />
    </div>
  );
}
