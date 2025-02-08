import { notFound } from 'next/navigation';
import bots from '@/app/data/bots';

export default async function BotPage({ params }: { params: { slug: string } }) {
  const bot = bots.find((bot) => bot.slug === params.slug);
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">{bot.title}</h1>
      <p>{bot.description}</p>
      <div className="mb-4" dangerouslySetInnerHTML={{ __html: bot.overview }} />
      <div>
        <h3 className="text-xl font-bold mb-2">Features</h3>
        <ul className="list-disc ml-6 mb-4">
          {bot.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p>{bot.details}</p>
      </div>
    </div>
  );
}
