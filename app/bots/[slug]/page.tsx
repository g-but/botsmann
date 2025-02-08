import { notFound } from 'next/navigation';
import bots from '../../data/bots';

export default function BotPage({ params }: { params: { slug: string } }) {
  const bot = bots.find((bot) => bot.slug === params.slug);
  
    return notFound();
  }

  return (
    <div>
      <h1>{bot.title}</h1>
      <p>{bot.description}</p>
      <div dangerouslySetInnerHTML={{ __html: bot.overview }} />
      <div>
        <h3>Features</h3>
        <ul>
          {bot.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p>{bot.details}</p>
      </div>
    </div>
  );
}
