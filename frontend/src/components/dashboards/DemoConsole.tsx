import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export default function DemoConsole() {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
  if (!isDemoMode) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<string>("EMPLOYEE");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("aura-demo-emulated-role");
    if (storedRole) {
      setActiveRole(storedRole);
    }
  }, []);

  const handleRoleSwitch = async (role: string) => {
    if (role === activeRole || isTransitioning) return;
    setIsTransitioning(true);

    // Guardar el rol en localStorage
    if (role === "REAL") {
      localStorage.removeItem("aura-demo-emulated-role");
      setActiveRole("EMPLOYEE"); // Fallback a EMPLOYEE como rol base inicial
    } else {
      localStorage.setItem("aura-demo-emulated-role", role);
      setActiveRole(role);
    }

    // Simular transición visual elegante de 800ms
    setTimeout(() => {
      // Limpiar toda la caché de TanStack Query para forzar refetch
      queryClient.clear();
      setIsTransitioning(false);
      setIsOpen(false);
      
      // Redirigir al dashboard general para evaluar el switch
      navigate({ to: "/dashboard" });
    }, 800);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] transition-opacity duration-300">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            <div>
              <h4 className="text-white font-bold text-sm">Cambiando de Rol...</h4>
              <p className="text-slate-400 text-xs mt-1">Reconfigurando permisos y cargando datos reales</p>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-xs py-2.5 px-4 rounded-full shadow-lg transition-all duration-300 animate-pulse hover:animate-none cursor-pointer"
        >
          <ShieldAlert size={14} className="animate-bounce" />
          <span>AURA Demo Console</span>
          <ChevronUp size={12} />
        </button>
      )}

      {/* Expanded Console Card */}
      {isOpen && (
        <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-800 rounded-2xl p-4 shadow-2xl w-80 text-left transition-all duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                AURA Demo Console
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
            Cambia instantáneamente la vista del juez simulando los datos y permisos reales de cada perfil sembrado en Sempra.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRoleSwitch("EMPLOYEE")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                activeRole === "EMPLOYEE"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex flex-col text-left">
                <span>Linette Acosta (Worker)</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Vista de Cursos y simulaciones</span>
              </div>
              {activeRole === "EMPLOYEE" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full">Activo</span>}
            </button>

            <button
              onClick={() => handleRoleSwitch("SUPERVISOR")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                activeRole === "SUPERVISOR"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex flex-col text-left">
                <span>Juan (Supervisor)</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Vista de analíticas y equipo</span>
              </div>
              {activeRole === "SUPERVISOR" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full">Activo</span>}
            </button>

            <button
              onClick={() => handleRoleSwitch("ADMIN")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                activeRole === "ADMIN"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex flex-col text-left">
                <span>Flavio Emiliano (Admin)</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Vista de Creador de Cursos IA</span>
              </div>
              {activeRole === "ADMIN" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full">Activo</span>}
            </button>
          </div>

          {localStorage.getItem("aura-demo-emulated-role") && (
            <button
              onClick={() => handleRoleSwitch("REAL")}
              className="w-full mt-3 text-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors py-1 border-t border-slate-800/80 cursor-pointer"
            >
              Restablecer a cuenta de Google real
            </button>
          )}
        </div>
      )}
    </div>
  );
}
