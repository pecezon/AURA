const FRAMEWORKS = ["NOM-029-STPS-2011", "NFPA 52", "STPS", "LOTO"];

export default function LandingRules() {
  return (
    <div id="rules" className="w-full bg-white py-16 px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-red-500 font-semibold text-xs uppercase tracking-widest">
            Cumplimiento Normativo
          </p>
          <p className="text-sm text-gray-500">
            AURA está alineado con los marcos regulatorios del sector energético
            industrial en México
          </p>
        </div>

        <div className="flex flex-row flex-wrap gap-3">
          {FRAMEWORKS.map((framework) => (
            <span
              key={framework}
              className="text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-4 py-2"
            >
              {framework}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
