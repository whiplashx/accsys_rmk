import React, { useState } from "react";
import { CloudIcon } from "lucide-react";
import { Button } from "@headlessui/react";

// Temporary placeholder for Dialog components
const Dialog = ({ children, open, onOpenChange }) => (
  open ? <div>{children}</div> : null
);
const DialogContent = ({ children }) => <div>{children}</div>;
const DialogHeader = ({ children }) => <div>{children}</div>;
const DialogTitle = ({ children }) => <h2>{children}</h2>;

// import { cn } from "@/lib/utils";


function UploadButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CloudIcon className="mr-2 h-4 w-4" />
        Upload
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
          </DialogHeader>
          <p>Content of the dialog</p>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadButton;

