import { Header } from '@/components/header';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  return (
    <div className="py-4">
      <Header />
      <main />
    </div>
  );
}
