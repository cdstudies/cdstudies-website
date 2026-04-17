"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SITE_NAME, TAX_ID } from "@/lib/constants";

export function CheckInstructions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-accent">
          You can also give by check — click for instructions
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Give by Check
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          <p>Please make your check payable to:</p>
          <p className="font-semibold text-foreground">{SITE_NAME}</p>
          <p>
            Mail your check to:
            <br />
            <span className="text-foreground">
              [Mailing address will be provided]
            </span>
          </p>
          <p>
            Please include your name and email address so we can send you a
            tax receipt.
          </p>
          <p className="text-xs">Tax ID: {TAX_ID}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
