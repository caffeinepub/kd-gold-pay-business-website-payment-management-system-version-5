import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProfileSetupModalProps {
  profileName: string;
  setProfileName: (name: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ProfileSetupModal({
  profileName,
  setProfileName,
  onSave,
  isSaving,
}: ProfileSetupModalProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to KD Gold Pay</DialogTitle>
          <DialogDescription>Please enter your name to get started with your account.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && profileName.trim()) {
                  onSave();
                }
              }}
            />
          </div>
          <Button onClick={onSave} disabled={!profileName.trim() || isSaving} className="w-full">
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
