import { Bot } from './data/bots';
import bots from './data/bots';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>Welcome to Botsmann</h1>
      <div>
        {bots.map((bot) => (
          <div key={bot.slug}>
            <h2>{bot.title}</h2>
            <p>{bot.description}</p>
            <Link href={`/bots/${bot.slug}`}>Learn More</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
