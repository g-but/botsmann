"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";

// Lazy load components for better performance
const EmailGenerator = dynamic(() => import("./components/EmailGenerator"), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
});

const TextGenerator = dynamic(() => import("./components/TextGenerator"), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
});

// Vocabulary Builder Component
const VocabularyBuilder = ({ getTryLink }: { getTryLink: () => string }) => {
  const [input, setInput] = useState("cat");
  const [showResponse, setShowResponse] = useState(false);

  const handleTranslate = () => {
    if (input.toLowerCase() === "cat") {
      setShowResponse(true);
    }
  };

  const response = {
    iigaba: "Chatz",
    iigabetyp: "Es Wort (es Nomen, Englisch)",
    table: [
      { term: "d'Chatz, -e", meaning: "CH: d'Chatz, -e DE: die Katze 1) Es Tier mit schnusigem Fell, wo gärn Muus fangt und schnurrt.", highGerman: "Die Katze schläft den ganzen Tag.", swissGerman: "D'Chatz schlaft de ganze Tag." },
      { term: "de Büsi, -", meaning: "CH: de Büsi, - DE: das Kätzchen 1) E chliini oder liebi Chatz.", highGerman: "Das Kätzchen spielt mit einem Wollknäuel.", swissGerman: "S'Büsi spielt mit em Wullechnäuel." },
      { term: "de Kater, -", meaning: "CH: de Kater, - DE: der Kater 1) E männlichi Chatz.", highGerman: "Der Kater sitzt auf dem Dach.", swissGerman: "De Kater sitzt ufem Dach." },
      { term: "s'Chätzli, -", meaning: "CH: s'Chätzli, - DE: das Kätzchen 1) E jungi oder chliini Chatz.", highGerman: "Das Kätzchen jagt eine Maus.", swissGerman: "S'Chätzli jagt e Muus." },
      { term: "d'Hauschatz, -e", meaning: "CH: d'Hauschatz, -e DE: die Hauskatze 1) E Chatz, wo bi de Lüüt im Huus lebt.", highGerman: "Die Hauskatze jagt keine Mäuse.", swissGerman: "D'Hauschatz jagt kei Muus." },
      { term: "d'Wildchatz, -e", meaning: "CH: d'Wildchatz, -e DE: die Wildkatze 1) E Chatz, wo wild und nöd zahm isch.", highGerman: "Wildkatzen leben in Wäldern.", swissGerman: "Wildchätz lebed i de Wäld." },
      { term: "d'Schmusechatz, -e", meaning: "CH: d'Schmusechatz, -e DE: die Schmusekatze 1) E Chatz, wo gärn kuschelt und gestreichelt wird.", highGerman: "Meine Katze ist eine richtige Schmusekatze.", swissGerman: "Mini Chatz isch e richtige Schmusechatz." },
      { term: "de Stubetiger, -", meaning: "CH: de Stubetiger, - DE: der Stubentiger 1) En häusligi Name für e Chatz.", highGerman: "Unser Stubentiger schläft auf dem Sofa.", swissGerman: "Oise Stubetiger schlaft uf em Sofa." },
      { term: "d'Mieze, -e", meaning: "CH: d'Mieze, -e DE: die Mieze 1) E liebi Usgang für e Chatz.", highGerman: "Die Mieze versteckt sich unter dem Tisch.", swissGerman: "D'Mieze versteckt sich under em Tisch." },
      { term: "de Fellchnäuel, -", meaning: "CH: de Fellchnäuel, - DE: der Fellknäuel 1) E liebi Beschribig für e Chatz mit vill Fell.", highGerman: "Der kleine Fellknäuel schnurrt zufrieden.", swissGerman: "De chlii Fellchnäuel schnurrt zfriede." },
    ],
    text: "D'Chatz vom Nachbar chunnt jede Tag i üsi Garte und macht sich do bequem. Sie legt sich uf mis Lounge-Polster und gseht mi mit ihre grossä, grüene Auge aa. Wenn ich nocher mit de Füdle chume, schnurrt sie und drückt sich an min Bei. Ich ha d'Chatz so gärn, aber sie ghört leider nöd mir. Villecht hol ich mir doch mal es Büsi für mis eiges Dihei."
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleTranslate()}
          placeholder="Enter a word"
          className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-openai-green"
          aria-label="Vocabulary input"
        />
        <button
          onClick={handleTranslate}
          className="px-6 py-3 bg-openai-green text-white rounded-md font-medium hover:bg-emerald-600 transition-all"
          aria-label="Translate word"
        >
          Translate
        </button>
      </div>
      {showResponse && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-slide-down">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Iigabä: {response.iigaba}</h4>
          <p className="text-gray-600 mb-4">Iigabetyp: {response.iigabetyp}</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">d'Iigabä</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">d'Bedütig</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Es Satz uf Hochdütsch</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Es Satz uf Züridütsch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {response.table.map((row: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 text-gray-600">{row.term}</td>
                    <td className="px-3 py-2 text-gray-600">{row.meaning}</td>
                    <td className="px-3 py-2 text-gray-600">{row.highGerman}</td>
                    <td className="px-3 py-2 text-gray-600">{row.swissGerman}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">5-Satz-Text uf Züridütsch</h4>
            <p className="text-gray-600">{response.text}</p>
          </div>
          <div className="text-center">
            <a href={getTryLink()} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-openai-green text-white rounded-md font-medium hover:bg-emerald-600 transition-all">
              Try More with Heidi
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Conversation Practice Component
const ConversationPractice = ({ getTryLink }: { getTryLink: () => string }) => {
  const [response, setResponse] = useState("");
  const router = useRouter();

  const handleResponseSubmit = () => {
    if (response.trim()) {
      const chatGptUrl = `${getTryLink()}?q=${encodeURIComponent(`Sali! Wöu mit mir es Kaffi trinke? - ${response}`)}`;
      window.open(chatGptUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-md shadow-sm">
        <p className="font-medium text-gray-900 mb-2">Nachricht:</p>
        <p className="text-gray-600">Sali! Wöu mit mir es Kaffi trinke?</p>
        <p className="text-xs text-gray-500 mt-1">Translation: Hi! Want to grab a coffee with me?</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleResponseSubmit()}
          placeholder="Type your response here..."
          className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-openai-green"
          aria-label="Conversation response input"
        />
        <button
          onClick={handleResponseSubmit}
          className="px-6 py-3 bg-openai-green text-white rounded-md font-medium hover:bg-emerald-600 transition-all"
          aria-label="Send response to Heidi"
        >
          Send to Heidi
        </button>
      </div>
    </div>
  );
};

// Grammar Explanations Component
const GrammarPractice = ({ getTryLink }: { getTryLink: () => string }) => {
  const [input, setInput] = useState("to sleep");
  const [showResponse, setShowResponse] = useState(false);

  const handlePractice = () => {
    if (input.toLowerCase() === "to sleep") {
      setShowResponse(true);
    }
  };

  const response = {
    iigaba: "schlafe",
    iigabetyp: "Es Wort (es Verb, Englisch)",
    table: [
      { term: "schlafe", meaning: "CH: schlafe / ha gschlofe DE: schlafen / schlief / habe geschlafen – Im Ruhezustand si, vor allem i de Nacht.", highGerman: "Ich schlafe jede Nacht acht Stunden.", swissGerman: "Ich schlaf jede Nacht acht Stund." },
      { term: "gschlofe", meaning: "CH: ha gschlofe / werd schlafe DE: habe geschlafen / schlief / werde schlafen – Vergangeni oder spöteri Ziit vom Schlafe.", highGerman: "Ich habe sehr schlecht geschlafen.", swissGerman: "Ich ha sehr schlächt gschlofe." },
      { term: "s'Nickerli", meaning: "CH: mach es Nickerli / ha es Nickerli gmacht DE: mache ein Nickerchen / machte ein Nickerchen / habe ein Nickerchen gemacht – Es churzi Schlafe am Tag.", highGerman: "Ich mache ein kurzes Nickerchen.", swissGerman: "Ich mach es chliises Nickerli." },
      { term: "müed", meaning: "CH: bin müed / bin müed gsi DE: bin müde / war müde / bin müde gewesen – Wenn me Schlaf bruucht.", highGerman: "Ich bin sehr müde.", swissGerman: "Ich bin sehr müed." },
      { term: "schnarche", meaning: "CH: schnarche / ha gschnarcht DE: schnarche / schnarchte / habe geschnarcht – Laute Geräusch im Schlaf mache.", highGerman: "Er schnarcht jede Nacht.", swissGerman: "Er schnarcht jede Nacht." },
      { term: "erwache", meaning: "CH: erwach / bi erwacht DE: wache auf / wachte auf / bin aufgewacht – Vom Schlafe wieder wache werde.", highGerman: "Ich wache um sechs Uhr auf.", swissGerman: "Ich erwach am sechs Uhr." },
      { term: "i Schlaf cho", meaning: "CH: chum i Schlaf / bi i Schlaf cho DE: schlafe ein / schlief ein / bin eingeschlafen – Mit Schlafe afange.", highGerman: "Ich bin schnell eingeschlafen.", swissGerman: "Ich bi schnäll i Schlaf cho." },
      { term: "d'Ruhe", meaning: "CH: bruuch Ruhe / ha Ruhe gha DE: brauche Ruhe / brauchte Ruhe / habe Ruhe gebraucht – Wenn's still isch und me entspanne chan.", highGerman: "Ich brauche Ruhe zum Schlafen.", swissGerman: "Ich bruuch Rueh zum Schlafe." },
      { term: "der Traum", meaning: "CH: träum / ha troome DE: träume / träumte / habe geträumt – Bilder und Gschichte im Schlaf.", highGerman: "Ich hatte einen schönen Traum.", swissGerman: "Ich ha es schöns Träumli gha." },
      { term: "d'Insomnia", meaning: "CH: ha Insomnia / ha Insomnia gha DE: habe Schlaflosigkeit / hatte Schlaflosigkeit / habe Schlaflosigkeit gehabt – Wenn me nöd chan schlafe.", highGerman: "Schlaflosigkeit ist mühsam.", swissGerman: "Insomnia isch mega müehsam." },
    ],
    conjugation: {
      "Jetzt-Ziit": ["schlaf", "schlafsch", "schlaft", "schlöfed", "schlöfed", "schlöfed"],
      "Vergangeni Ziit": ["ha gschlofe", "hesch gschlofe", "hät gschlofe", "händ gschlofe", "händ gschlofe", "händ gschlofe"],
      "Spöteri Ziit": ["werd schlafe", "wirsch schlafe", "wird schlafe", "werde schlafe", "werde schlafe", "werde schlafe"]
    },
    text: "Ich schlaf viel z'wänig, drum bin ich morns immer müed. 🥱 Gschter ha ich nur vier Stund gschlofe, und das gspür ich hüt de ganz Tag. Wenn ich müed bi, chan ich überall i Schlaf cho, sogar im Tram. 🚋 Aber s'Beschti isch, wenn me am Wuchenänd so lang schlofe chan, wie me wett. 😴 Hüt am Abig goh ich extra früe is Bett, dass ich mal wieder richtig erholt bi."
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handlePractice()}
          placeholder="Enter a verb (e.g., 'to sleep')"
          className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-openai-green"
          aria-label="Grammar input"
        />
        <button
          onClick={handlePractice}
          className="px-6 py-3 bg-openai-green text-white rounded-md font-medium hover:bg-emerald-600 transition-all"
          aria-label="Practice grammar"
        >
          Practice
        </button>
      </div>
      {showResponse && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-slide-down">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Iigabä: {response.iigaba}</h4>
          <p className="text-gray-600 mb-4">Iigabetyp: {response.iigabetyp}</p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">d'Iigabä</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">d'Bedütig</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Es Satz uf Hochdütsch</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Es Satz uf Züridütsch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {response.table.map((row: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 text-gray-600">{row.term}</td>
                    <td className="px-3 py-2 text-gray-600">{row.meaning}</td>
                    <td className="px-3 py-2 text-gray-600">{row.highGerman}</td>
                    <td className="px-3 py-2 text-gray-600">{row.swissGerman}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Wie me „{response.iigaba}" im Züridütsch brucht</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Person</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Jetzt-Ziit</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Vergangeni Ziit</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Spöteri Ziit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {["Ich", "Du", "Er / Sie / Es", "Mir", "Ihr", "Sie"].map((person, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 py-2 text-gray-600">{person}</td>
                      <td className="px-3 py-2 text-gray-600">{response.conjugation["Jetzt-Ziit"][index]}</td>
                      <td className="px-3 py-2 text-gray-600">{response.conjugation["Vergangeni Ziit"][index]}</td>
                      <td className="px-3 py-2 text-gray-600">{response.conjugation["Spöteri Ziit"][index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">5-Satz-Text uf Züridütsch</h4>
            <p className="text-gray-600">{response.text}</p>
          </div>
          <div className="text-center">
            <a href={getTryLink()} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-openai-green text-white rounded-md font-medium hover:bg-emerald-600 transition-all">
              Try More with Heidi
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SwissGermanTeacher() {
  // State variables
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [preferences, setPreferences] = useState({
    events: false,
    newsletters: false,
    blog: false,
    videos: false,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [demoResponseType, setDemoResponseType] = useState<string>("");

  const popupRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // CSS classes
  const btnPrimary = "px-6 py-3 bg-openai-green text-white rounded-md font-medium hover:bg-emerald-600 transition-all";
  const btnSecondary = "px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-all";
  const cardStyle = "p-8 bg-white rounded-xl shadow-sm border border-gray-200";
  const comingSoonBadge = "absolute top-2 right-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200";
  const featureNumberBadge = "flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4";
  const featureNumberText = "text-sm font-semibold text-blue-600";

  // Demo data
  const chatzTableData = [
    {
      term: "d'Chatz, -e",
      meaning: "die Katze (cat)",
      highGerman: "Die Katze schläft auf dem Sofa.",
      swissGerman: "D'Chatz schloft ufem Sofa."
    },
    {
      term: "de Stubetiger, -",
      meaning: "der Stubentiger (house cat)",
      highGerman: "Unser Stubentiger fängt keine Mäuse.",
      swissGerman: "Euse Stubetiger fangt kei Müüs."
    },
    {
      term: "d'Büsi, -s",
      meaning: "das Kätzchen (kitten/cat - affectionate)",
      highGerman: "Das Büsi ist sehr verspielt.",
      swissGerman: "S'Büsi isch sehr verspilt."
    }
  ];

  // Function to generate a chat link
  const getTryLink = () => {
    return "https://chat.openai.com/g/g-sKnMQdpKf-heidi-swiss-german-teacher";
  };

  // Handler functions
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setWaitlistSubmitted(true);
    }, 1000);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const generateDemoResponse = () => {
    if (inputValue.toLowerCase().includes("cat") || inputValue.toLowerCase().includes("chatz")) {
      setDemoResponseType("cat");
      setDemoResponse("Information about the Swiss German word for 'cat'");
    } else {
      setDemoResponseType("text");
      setDemoResponse(`Here's how to say "${inputValue}" in Swiss German: [simulated response]`);
    }
  };

  // Table of Contents items
  const tocItems: TOCItem[] = [
    { id: 'intro', label: 'Introduction' },
    { 
      id: 'language-learning', 
      label: 'Language Learning',
      subItems: [
        { id: 'vocabulary-builder', label: 'Vocabulary Builder' },
        { id: 'conversation-practice', label: 'Conversation Practice' },
        { id: 'grammar-explanations', label: 'Grammar Explanations' },
      ]
    },
    {
      id: 'communication', 
      label: 'Communication Assistance',
      subItems: [
        { id: 'email-examples', label: 'Email Writing' },
        { id: 'texting-examples', label: 'Texting Help' },
      ]
    },
    { 
      id: 'integration', 
      label: 'Social',
      subItems: [
        { id: 'events', label: 'Zürich Events' },
        { id: 'cultural-insights', label: 'Cultural Insights' },
      ]
    },
    { id: 'swiss-content', label: 'Swiss Content' },
    { id: 'future-vision', label: 'Development Roadmap' },
    { id: 'waitlist-form', label: 'Join Waitlist' },
  ];

  // Check for demo mode and scroll to top when page loads
  useEffect(() => {
    if (searchParams?.get("demo") === "true") {
      setDemoMode(true);
    }
    
    // Always scroll to top on page load
    window.scrollTo(0, 0);
    
    // If there's a hash in the URL, clear it to prevent auto-scrolling
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add noscript fallback for progressive enhancement */}
      <noscript>
        <p className="text-center text-gray-600 p-4">
          JavaScript is required to use the interactive features. Please enable it or visit{' '}
          <a href={getTryLink()} className="text-openai-green underline">Heidi's bot</a> directly.
        </p>
      </noscript>
      
      <main className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Heidi 🐄
            </h1>
            <p className="text-2xl text-gray-800 font-medium mb-4">
              Learn Swiss German and Navigate Zurich with AI 🇨🇭
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Personalized guidance to help you master Swiss German and connect with Swiss culture
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={getTryLink()} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                Try Heidi for Free
              </a>
              <a href="#features" className={btnSecondary}>
                Explore Features
              </a>
            </div>
          </div>
          
          {/* Feature Navigation Tiles */}
          <div id="features" className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Language Tile */}
              <a href="#language-learning" className="group flex flex-col p-6 bg-white border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Language Learning</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Master Swiss German through personalized lessons, vocabulary building, and conversation practice with Heidi's intuitive tools.
                </p>
                <div className="mt-auto text-openai-green font-medium flex items-center">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>

              {/* Communication Tile */}
              <a href="#communication" className="group flex flex-col p-6 bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Communication</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Craft emails in High German and text messages in Swiss German for everyday situations
                </p>
                <div className="mt-auto text-openai-green font-medium flex items-center">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>

              {/* Social Tile */}
              <a href="#integration" className="group flex flex-col p-6 bg-white border border-purple-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Social</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Connect with the local community through events and cultural insights
                </p>
                <div className="mt-auto text-openai-green font-medium flex items-center">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>

              {/* Swiss Content Tile */}
              <a href="#swiss-content" className="group flex flex-col p-6 bg-white border border-amber-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4 group-hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Swiss Content</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Enhance your learning with authentic Swiss German content curated to match your proficiency level
                </p>
                <div className="mt-auto text-openai-green font-medium flex items-center">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents */}
            <TableOfContents items={tocItems} />
            
            <div className="flex-1">
              {/* Language Learning Section */}
              <section id="language-learning" className="mb-24 pb-6 pt-6 px-6 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900">Language Learning</h2>
                </div>
                <p className="text-lg text-gray-600 mb-8 ml-14">
                  Master Swiss German through personalized lessons, vocabulary building, and conversation practice with Heidi's intuitive tools.
                </p>

                <div id="vocabulary-builder" className={`${cardStyle} mb-10`}>
                  <h3 className="text-xl font-semibold mb-2">Vocabulary Builder</h3>
                  <p className="mb-4">Build your Swiss German vocabulary with contextually-relevant words and phrases—try translating "cat" below!</p>
                  <VocabularyBuilder getTryLink={getTryLink} />
                </div>

                <div id="conversation-practice" className={`${cardStyle} mb-10`}>
                  <h3 className="text-xl font-semibold mb-2">Conversation Practice</h3>
                  <p className="mb-4">Practice everyday conversations by responding to messages—Heidi will take it from there!</p>
                  <ConversationPractice getTryLink={getTryLink} />
                </div>

                <div id="grammar-explanations" className={`${cardStyle} mb-10`}>
                  <h3 className="text-xl font-semibold mb-2">Grammar Explanations</h3>
                  <p className="mb-4">Learn Swiss German grammar by practicing any topic—start with "to sleep" below!</p>
                  <GrammarPractice getTryLink={getTryLink} />
                </div>
              </section>

              {/* Communication Assistance Section */}
              <section id="communication" className="mb-24 pb-6 pt-6 px-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900">Communication Assistance</h2>
                </div>
                <p className="text-lg text-gray-600 mb-8 ml-14">
                  Learn to communicate effectively in Swiss German for everyday situations, from professional emails to casual text messages.
                </p>

                <div id="email-examples" className={`${cardStyle} mb-10`}>
                  <h3 className="text-xl font-semibold mb-2">Email Writing</h3>
                  <p className="mb-4">
                    Generate Swiss-style emails that follow cultural norms and use dialect-appropriate expressions, or get help responding to German emails you've received.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-md text-sm mb-4 shadow-sm">
                      <p className="font-semibold mb-1">What You Asked For:</p>
                      <p className="text-gray-600 italic">
                        "Help me write an email to reschedule an apartment viewing"
                      </p>
                      <p className="font-semibold mt-3 mb-1">High German Response (Professional Context):</p>
                      <p className="text-gray-600 italic">
                        Sehr geehrte Frau Meier,<br />
                        Ich schreibe Ihnen bezüglich der Wohnungsbesichtigung am kommenden Donnerstag.<br />
                        Wäre es möglich, den Termin auf 18:00 Uhr zu verschieben?<br />
                        Mit freundlichen Grüßen,<br />
                        Thomas
                      </p>
                      <p className="text-xs text-gray-500 mt-1">*Heidi noted: This formal structure follows the standard format used by native German speakers in professional contexts.</p>
                    </div>
                    <div className="bg-white p-3 rounded-md text-sm shadow-sm">
                      <p className="font-semibold mb-1">Swiss German Response (Informal Context):</p>
                      <p className="text-gray-600 italic">
                        Sali Frau Meier,<br />
                        Ich schriibe dir wäg de Wonigsbsichtigung am Donnstig.<br />
                        Wärs möglich, de Termin uf di Sechsi z'verschiebe?<br />
                        Merci vilmal und en schöne Tag,<br />
                        Thomas
                      </p>
                      <p className="text-xs text-gray-500 mt-1">*Heidi noted: I've used the Zürich dialect forms you've been practicing, avoiding the Basel expressions you frequently confused in our sessions.</p>
                      <p className="text-xs text-gray-400 mt-1">Translation: Hi Ms. Meier, I'm writing about the apartment viewing on Thursday. Would it be possible to move it to 6 PM? Thanks a lot and have a nice day, Thomas</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-medium mb-3">Try It Yourself</h4>
                      <p className="text-gray-600 mb-4">Generate your own Swiss-style email:</p>
                      <EmailGenerator getTryLink={getTryLink} />
                    </div>
                  </div>
                  <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-2">Ask Heidi To:</h4>
                    <ul className="mb-4 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>"Write an email in High German to my landlord about a repair"</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>"Help me understand this email: [paste German email]"</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>"Draft a response to this message with more details"</span>
                      </li>
                    </ul>
                    <div className="text-center">
                      <a href={getTryLink()} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                        Get Email Help from Heidi
                      </a>
                    </div>
                  </div>
                </div>

                <div id="texting-examples" className={`${cardStyle} mb-10`}>
                  <h3 className="text-xl font-semibold mb-2">Texting Help</h3>
                  <p className="mb-4">
                    Master everyday Swiss German texting with dialect-appropriate casual expressions, or get help understanding messages you've received.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-md text-sm mb-4 shadow-sm">
                      <p className="font-semibold mb-2">Common Zürich Texting Phrases:</p>
                      <ul className="space-y-2">
                        <li>
                          <span className="font-medium">Sali! Wie gaht's?</span>
                          <span className="text-gray-600 block mt-1">Hi! How are you? (Casual greeting)</span>
                        </li>
                        <li>
                          <span className="font-medium">Ich bi spöter. Sorry!</span>
                          <span className="text-gray-600 block mt-1">I'll be late. Sorry!</span>
                          <span className="text-xs text-gray-400 block">Translation: I'm late. Sorry!</span>
                        </li>
                        <li>
                          <span className="font-medium">Treffe mer üs am Bellevue?</span>
                          <span className="text-gray-600 block mt-1">Shall we meet at Bellevue?</span>
                          <span className="text-xs text-gray-400 block">Translation: Shall we meet at Bellevue?</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-medium mb-3">Try It Yourself</h4>
                      <p className="text-gray-600 mb-4">Get quick texting tips in Swiss German:</p>
                      <TextGenerator getTryLink={getTryLink} />
                    </div>
                  </div>
                  <div className="mt-6 bg-white p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-2">Ask Heidi To:</h4>
                    <ul className="mb-4 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>"Write a WhatsApp message in Swiss German to invite a friend for coffee"</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>"What does this Swiss German message mean: [paste message]"</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>"Help me respond to this message about weekend plans"</span>
                      </li>
                    </ul>
                    <div className="text-center">
                      <a href={getTryLink()} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                        Message Like a Local
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Social Integration Section */}
              <section id="integration" className="mb-24 pb-6 pt-6 px-6 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900">Social</h2>
                </div>
                <p className="text-lg text-gray-600 mb-8 ml-14">
                  Connect with the local community by discovering cultural events and understanding local customs.
                </p>

                {/* Events */}
                <div id="events" className={`${cardStyle} mb-10`}>
                  <h3 className="text-xl font-semibold mb-2">Zürich Events</h3>
                  <div className="flex items-center mb-4">
                    <p className="text-gray-600 mr-3">
                      Find events in Zürich that reinforce your language learning and help you connect with locals.
                    </p>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                      Beta Feature
                    </span>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-white border rounded-md shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Swiss Language Exchange Meetup</p>
                          <p className="text-sm text-gray-600 mb-2">Tonight, 7pm at Café Sphères</p>
                          <p>Practice Swiss German with locals in a relaxed setting with guided conversation topics.</p>
                        </div>
                        <a 
                          href="https://www.meetup.com/zurich-german-language-exchange/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-all ml-2 shrink-0"
                        >
                          Event Info
                        </a>
                      </div>
                    </div>

                    <div className="p-4 bg-white border rounded-md shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Adriatique at Zukunft</p>
                          <p className="text-sm text-gray-600 mb-2">Saturday, 11pm at Zukunft Club</p>
                          <p>Meet people while enjoying music in one of Zürich's most popular venues.</p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-2 shrink-0">
                          <a 
                            href="https://zukunft.cl" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-all text-center"
                          >
                            Event Info
                          </a>
                          <a 
                            href="https://zukunft.cl/tickets" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-all text-center"
                          >
                            Buy Ticket
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white border rounded-md shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Ferdinand Hodler Exhibit</p>
                          <p className="text-sm text-gray-600 mb-2">This weekend at Kunsthaus Zürich</p>
                          <p>Explore Swiss art history and connect with art enthusiasts at this special exhibition.</p>
                        </div>
                        <a 
                          href="https://www.kunsthaus.ch" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-all ml-2 shrink-0"
                        >
                          Event Info
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <a
                        href={getTryLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnPrimary}
                      >
                        Find More Events
                      </a>
                    </div>
                  </div>
                </div>

                {/* Cultural Insights */}
                <div id="cultural-insights" className={`${cardStyle} mb-10 relative`}>
                  <div className={comingSoonBadge}>Coming Soon</div>
                  <h3 className="text-xl font-semibold mb-2">Cultural Insights</h3>
                  <p className="mb-4">
                    Understand Swiss customs, traditions, and social norms to navigate daily life with confidence.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Social Etiquette</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Greetings and introductions</li>
                        <li>• Punctuality and time management</li>
                        <li>• Dining customs and tipping</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Local Traditions</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Seasonal festivals and celebrations</li>
                        <li>• Regional customs and foods</li>
                        <li>• Holidays and observances</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">History</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Formation of the Swiss Confederation</li>
                        <li>• Historical neutrality and humanitarian effort</li>
                        <li>• Evolution of Swiss identity and culture</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-white rounded-md shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Civics & Governance</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Direct democracy and referendum system</li>
                        <li>• Federalism and cantonal structure</li>
                        <li>• Neutrality</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className={btnSecondary}
                    >
                      Get Notified When Available
                    </button>
                  </div>
                </div>
              </section>
              
              {/* Swiss Content Section */}
              <section id="swiss-content" className="mb-24 pb-6 pt-6 px-6 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900">Swiss Content</h2>
                  <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                    Coming Soon
                  </span>
                </div>
                <p className="text-lg text-gray-600 mb-8 ml-14">
                  Enhance your learning with authentic Swiss German content curated to match your proficiency level.
                </p>
                
                <div className={`${cardStyle} relative`}>
                  <p className="text-lg text-gray-600 mb-6">
                    Our team is currently developing a rich library of content to help you immerse yourself in Swiss German language and culture.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-5 bg-white rounded-md text-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <h3 className="font-medium text-gray-900 mb-2">Video Content</h3>
                      <p className="text-sm text-gray-600">Short videos with subtitles in Standard and Swiss German</p>
                    </div>
                    
                    <div className="p-5 bg-white rounded-md text-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <h3 className="font-medium text-gray-900 mb-2">Podcasts</h3>
                      <p className="text-sm text-gray-600">Audio content with transcripts for listening practice</p>
                    </div>
                    
                    <div className="p-5 bg-white rounded-md text-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <h3 className="font-medium text-gray-900 mb-2">Articles</h3>
                      <p className="text-sm text-gray-600">News articles and blog posts with vocabulary assistance</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className={btnSecondary}
                    >
                      Join Waitlist for Early Access
                    </button>
                  </div>
                </div>
              </section>
              
              {/* Future of Swiss German Learning Section */}
              <section id="future-vision" className="py-12 bg-gray-50 rounded-xl mb-16">
                <div className="px-6">
                  <h2 className="mb-6 text-3xl font-semibold text-center text-gray-900">
                    The Future of Swiss German Learning
                  </h2>
                  <p className="mb-6 text-lg text-gray-600">
                    We're building Heidi to transform how people learn Swiss German and engage with Swiss culture. Our vision extends beyond language learning to create meaningful connections and authentic experiences.
                  </p>
                  
                  <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-medium text-gray-900 mb-3">Help Us Build Heidi</h3>
                    <p className="text-gray-600 mb-4">
                      We're actively looking for Swiss German experts, linguists, and skilled engineers to join our team and help create the next generation of language learning technology.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">We're Looking For:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Swiss German native speakers and dialect experts</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Computational linguists with NLP experience</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Full-stack developers with AI experience</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Get Involved:</h4>
                        <p className="text-gray-600 mb-3">Interested in contributing to Heidi's development? Let us know your expertise.</p>
                        <a 
                          href="mailto:join@botsmann.com" 
                          className="inline-flex items-center text-openai-green font-medium hover:underline"
                        >
                          <span>Contact our team</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">Development Roadmap:</h3>
                    <ul className="space-y-4">
                      <li className="flex">
                        <div className={featureNumberBadge}>
                          <span className={featureNumberText}>1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">User Profiles</h4>
                          <p className="text-gray-600">Personalized learning experiences that remember your progress and adapt to your needs.</p>
                          <p className="text-sm text-gray-500 mt-1">Target: Q3 2025</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className={featureNumberBadge}>
                          <span className={featureNumberText}>2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Zürich Event Integration</h4>
                          <p className="text-gray-600">Find events that match your interests and help you connect with like-minded people.</p>
                          <p className="text-sm text-gray-500 mt-1">Target: Q3 2025</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className={featureNumberBadge}>
                          <span className={featureNumberText}>3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Swiss German Content Library</h4>
                          <p className="text-gray-600">Curated collection of videos, podcasts, and articles to immerse yourself in the language.</p>
                          <p className="text-sm text-gray-500 mt-1">Target: Q4 2025</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className={featureNumberBadge}>
                          <span className={featureNumberText}>4</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Progressive Learning System</h4>
                          <p className="text-gray-600">Smart vocabulary practice that optimizes your learning path based on your progress.</p>
                          <p className="text-sm text-gray-500 mt-1">Target: Q1 2026</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center mt-8 pt-6 border-t border-gray-200">
                    <p className="mb-4 text-gray-600">
                      Have questions about our roadmap or want to contribute to Heidi's development?
                    </p>
                    <a 
                      href="mailto:team@botsmann.com" 
                      className="inline-flex items-center justify-center text-openai-green hover:underline"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact our development team
                    </a>
                  </div>
                </div>
              </section>
              
              {/* Waitlist Form Section */}
              <section id="waitlist-form" className="mb-16 max-w-3xl mx-auto">
                <div className={cardStyle}>
                  <h2 className="text-3xl font-semibold text-center text-gray-900 mb-4">Join Waitlist</h2>
                  {waitlistSubmitted ? (
                    <p className="text-green-600 text-center">Thank you! You're on the list.</p>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-openai-green"
                        aria-label="Email for waitlist"
                        required
                      />
                      <div>
                        <p className="block text-sm font-medium text-gray-700">Interests (optional):</p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {(['events', 'newsletters', 'blog', 'videos'] as const).map((key) => (
                            <div key={key} className="flex items-center">
                              <input
                                type="checkbox"
                                id={key}
                                name={key}
                                className="h-4 w-4 text-openai-green focus:ring-openai-green"
                                checked={preferences[key]}
                                onChange={handlePreferenceChange}
                              />
                              <label htmlFor={key} className="ml-2 text-sm text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full ${btnPrimary} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {submitting ? 'Submitting...' : 'Join Waitlist'}
                      </button>
                      {formError && <p className="mt-2 text-sm text-red-600" role="alert">{formError}</p>}
                    </form>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      {/* Chatz Popup */}
      {typeof window !== 'undefined' && isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && togglePopup()}
        >
          <div
            ref={popupRef}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative"
          >
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
              aria-label="Close popup"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Heidi's Output</h3>
            <p className="text-gray-600 mb-2">Iigabä: Chatz</p>
            <p className="text-gray-600 mb-4">Iigabetyp: Es Wort (es Nomen, Englisch) – Contextual learning aid</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">d'Iigabä</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">d'Bedütig</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Es Satz uf Hochdütsch</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Es Satz uf Züridütsch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {chatzTableData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-gray-600">{row.term}</td>
                      <td className="px-3 py-2 text-gray-600">{row.meaning}</td>
                      <td className="px-3 py-2 text-gray-600">{row.highGerman}</td>
                      <td className="px-3 py-2 text-gray-600">{row.swissGerman}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Züridütsch Text</h4>
              <p className="text-gray-600">
                Mini Chatz isch e Schmusechatz und schnurrt jede Nacht uf em Sofa. Sie jagt gärn de Büsi im Garte, wo all d'Chätzli spiled. Hüt ha i e Text gschickt, dass i sie mit ans Zürcher Katzefäscht nimm—sie isch echt e Stubetiger!
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">Try more Swiss German words and phrases with Heidi!</p>
              <a 
                href={getTryLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={btnPrimary}
              >
                Continue with Heidi
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Demo mode - Render only on client side */}
      {typeof window !== 'undefined' && demoMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Heidi Demo Mode</h2>
            {demoResponse ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Your Input: "{inputValue}"</h3>
                {demoResponseType === 'cat' ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">d'Iigabä</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">d'Bedütig</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hochdütsch</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Züridütsch</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-3 py-2 text-sm text-gray-500">d'Chatz, -e</td>
                            <td className="px-3 py-2 text-sm text-gray-500">CH: d'Chatz DE: die Katze</td>
                            <td className="px-3 py-2 text-sm text-gray-500">Die Katze miaut laut.</td>
                            <td className="px-3 py-2 text-sm text-gray-500">D'Chatz miaut luut.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">This is a simulated response for local development.</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{demoResponse}</p>
                    <p className="mt-4 text-sm text-gray-500">This is a simulated response for local development.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <p>Enter a word or phrase to see how Heidi would respond.</p>
                <p className="text-sm text-gray-500 mt-2">Try the word "cat" to see a special formatted response!</p>
                <div className="mt-4 flex gap-4">
                  <input
                    type="text"
                    placeholder="Try 'cat' or any other word"
                    className="flex-grow border border-gray-300 rounded-md p-2"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <button
                    className="bg-openai-green text-white px-4 py-2 rounded-md"
                    onClick={generateDemoResponse}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <button
                className="text-gray-700 hover:text-gray-900"
                onClick={() => {
                  setDemoMode(false);
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/bots/swiss-german-teacher');
                  }
                }}
              >
                Close Demo
              </button>
              {demoResponse && (
                <button
                  className="text-openai-green hover:underline"
                  onClick={() => {
                    setDemoResponse(null);
                  }}
                >
                  Try Another Word
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-in-out;
        }
        
        /* Add scroll margin to section headings to account for fixed header */
        section[id] {
          scroll-margin-top: 80px;
        }
      `}</style>
    </div>
  );
}

// This is a comment to demonstrate GitHub deployment workflow
