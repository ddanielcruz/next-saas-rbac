import { Header } from '@/components/header';
import { Tabs } from '@/components/tabs';

export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <Header borderless className="pb-0" />
        <Tabs />
      </div>
      <main className="mx-auto w-full max-w-7xl space-y-4 p-4">{children}</main>
    </div>
  );
}
