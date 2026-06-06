import * as Dialog from "@radix-ui/react-dialog";
import { X, Play, History } from "lucide-react";

export function LogWorkoutModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-card border border-border p-0 shadow-2xl rounded-2xl z-[101] animate-in zoom-in-95 fade-in duration-200">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <Dialog.Title className="font-display text-2xl tracking-tight">
                START WORKOUT
              </Dialog.Title>
              <Dialog.Description className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                Select your training method
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 rounded-full hover:bg-elevated text-muted-foreground transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          <div className="p-8 space-y-4">
            <button className="flex items-center gap-6 p-6 w-full bg-brand/5 border border-brand/20 rounded-2xl hover:bg-brand/10 transition-colors group text-left">
              <div className="size-14 rounded-full bg-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                <Play fill="currentColor" size={28} />
              </div>
              <div>
                <span className="font-display text-xl tracking-tight block">EMPTY WORKOUT</span>
                <span className="text-sm text-muted-foreground">
                  Start from scratch with no template
                </span>
              </div>
            </button>

            <button className="flex items-center gap-6 p-6 w-full bg-surface/40 border border-border rounded-2xl hover:bg-surface/60 transition-colors group text-left">
              <div className="size-14 rounded-full bg-elevated flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                <History size={28} />
              </div>
              <div>
                <span className="font-display text-xl tracking-tight block">USE TEMPLATE</span>
                <span className="text-sm text-muted-foreground">
                  Pick from your existing routines
                </span>
              </div>
            </button>
          </div>

          <div className="p-6 bg-surface/40 border-t border-border flex justify-center">
            <button className="text-[10px] font-mono text-brand hover:underline font-bold uppercase tracking-widest">
              Manage Templates & Routines →
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
