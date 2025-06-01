import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NewComicModal } from '@/components/NewComicModal';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-surface tracking-tight">
          Welcome to Your <span className="text-accent">Comic Collection</span>
        </h2>
        <p className="text-light-accent text-lg max-w-2xl">
          Your digital sanctuary for organizing and enjoying your favorite comic books. Start
          building your collection today!
        </p>
      </div>

      <NewComicModal>
        <Button className="bg-accent hover:bg-accent/90 text-surface cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Comic
        </Button>
      </NewComicModal>

      <div className="w-full max-w-2xl p-6 bg-primary rounded-xl shadow-xl border border-accent/10">
        <div className="text-center space-y-4">
          <p className="text-surface/80">
            Your collection is empty. Add your first comic to get started!
          </p>
        </div>
      </div>
    </div>
  );
}
