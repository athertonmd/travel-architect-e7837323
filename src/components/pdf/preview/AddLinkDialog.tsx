
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (linkName: string, linkUrl: string) => void;
}

export function AddLinkDialog({ isOpen, onOpenChange, onAdd }: AddLinkDialogProps) {
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const handleAdd = () => {
    onAdd(newLinkName, newLinkUrl);
    setNewLinkName("");
    setNewLinkUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Quick Link</DialogTitle>
          <DialogDescription>
            Add a new link to the quick links section of your PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-link-name" className="text-right">
              Link Title
            </Label>
            <Input
              id="new-link-name"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-link-url" className="text-right">
              URL
            </Label>
            <Input
              id="new-link-url"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
