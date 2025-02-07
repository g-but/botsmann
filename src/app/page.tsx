import ConsultationForm from '@/components/ConsultationForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed w-full px-16 py-8 flex justify-between items-center bg-black/80 backdrop-blur-lg z-50">
        <div className="text-2xl font-semibold">Botsmann</div>
        <div className="space-x-8">
          <a href="#solutions" className="text-white/80 hover:text-white transition-opacity">Solutions</a>
          <a href="#contact" className="text-white/80 hover:text-white transition-opacity">Contact</a>
        </div>
      </nav>

      <main>
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-8">
          <h1 className="text-6xl font-semibold mb-4 md:text-4xl">
            AI Solutions for{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
              Human Progress
            </span>
          </h1>
          <p className="text-xl">
            Transforming industries through advanced robotics and artificial intelligence
          </p>
        </section>

        <section id="contact" className="max-w-2xl mx-auto px-8 py-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Contact Us</h2>
          <ConsultationForm />
        </section>
      </main>
    </div>
  );
}
