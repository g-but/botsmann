import { notFound } from 'next/navigation';
import bots from '@/app/data/bots';

export default function BotPage({ params }: { params: { slug: string } }) {
  const bot = bots.find((bot) => bot.slug === params.slug);
  
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">{bot.title}</h1>
      <p className="mb-4">{bot.description}</p>
      <div className="mb-6" dangerouslySetInnerHTML={{ __html: bot.overview }} />
      <div>
        <h3 className="text-xl mb-4">Features</h3>
        <ul className="list-disc pl-6 mb-4">
          {bot.features.map((feature) => (
            <li key={feature} className="mb-2">{feature}</li>
          ))}
        </ul>
        <p>{bot.details}</p>
      </div>
    </div>
  );
}
