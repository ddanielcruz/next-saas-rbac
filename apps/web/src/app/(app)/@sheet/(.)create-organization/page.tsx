import { InterceptedSheet } from '@/components/intercepted-sheet';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { OrganizationForm } from '../../create-organization/organization-form';

export default function CreateOrganizationSheet() {
  return (
    <InterceptedSheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create organization</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <OrganizationForm />
        </div>
      </SheetContent>
    </InterceptedSheet>
  );
}
