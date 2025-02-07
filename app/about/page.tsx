import ConsultationForm from '../../components/ConsultationForm';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-center text-4xl font-bold mb-6">About Us</h1>
      <p className="mb-6 text-lg">
        We are a dedicated consulting firm focused on providing innovative AI and robotics solutions that transform industries.
        Our mission is to empower businesses and individuals with cutting-edge technology and strategic consultation.
      </p>
      <ConsultationForm />
    </main>
  );
} 