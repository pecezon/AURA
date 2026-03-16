import { Brain, ShieldCheck, Zap } from "lucide-react";
import LoginCard from "../components/login-card";
import LoginFormCard from "../components/login-form-card";

export default function Login() {
  const CARDS_INFO = {
    title: "AURA",
    description: "Adaptive Understanding of Risk in Action",
    cards: [
      {
        title: "Aprendizaje Inteligente",
        description:
          "Evaluación conductual basada en IA que va más allá del conocimiento teórico.",
        icon: <Brain size={28} className="text-blue-400" />,
      },
      {
        title: "Simulaciones Dinámicas",
        description:
          "Enfrenta escenarios realistas y desarrolla toma de desiciones bajo presión.",
        icon: <Zap size={28} className="text-yellow-400" />,
      },
      {
        title: "Cumplimiento Normativo",
        description:
          "Alineado con NOM-029-STPS-2011, NFPA y estándares de SEMPRA Infraestructura.",
        icon: <ShieldCheck size={28} className="text-green-400" />,
      },
    ],
  };

  return (
    <div className="flex pt-10 p-5 min-h-screen items-center justify-center bg-linear-to-tl from-slate-900 via-blue-800 to-slate-900">
      <div className="flex flex-col gap-5 justify-center">
        <h1 className="text-4xl font-bold text-white ">{CARDS_INFO.title}</h1>
        <p className="text-lg text-gray-300">{CARDS_INFO.description}</p>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-5">
          <div className="flex flex-col gap-4 w-full">
            {CARDS_INFO.cards.map((card) => (
              <LoginCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>

          <LoginFormCard />
        </div>
      </div>
    </div>
  );
}
