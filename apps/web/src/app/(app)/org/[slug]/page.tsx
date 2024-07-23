import { Header } from '@/components/header';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-7xl space-y-4 py-4" />
    </div>
  );
}
