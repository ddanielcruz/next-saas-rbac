import { ProjectForm } from '@/app/(app)/org/[org]/create-project/project-form';
import { InterceptedSheet } from '@/components/intercepted-sheet';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function CreateProjectSheet() {
  return (
    <InterceptedSheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Project</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm />
        </div>
      </SheetContent>
    </InterceptedSheet>
  );
}
