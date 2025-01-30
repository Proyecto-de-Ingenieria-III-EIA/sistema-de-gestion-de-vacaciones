import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const Modal = ({
  children,
  title,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
