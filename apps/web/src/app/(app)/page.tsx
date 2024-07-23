import { Header } from '@/components/header';

export default async function Home() {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-7xl space-y-4 p-4">
        <p className="text-sm text-muted-foreground">Select an organization</p>
      </main>
    </div>
  );
}
