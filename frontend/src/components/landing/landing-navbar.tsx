import { ArrowRightCircle } from "lucide-react";

export default function LandingNavbar() {
  const NAV_LINKS = [
    { label: "Plataforma", href: "#about" },
    { label: "Simulaciones", href: "#layers" },
    { label: "Supervisores", href: "#roles" },
    { label: "Normatividad", href: "#rules" },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);

    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="fixed top-0 w-full border-b bg-white backdrop-blur-sm px-4 py-2 flex items-center justify-between min-h-16 md:px-16 md:py-4 z-50">
      {/* Logo */}
      <div className="flex items-center gap-5">
        <img
          src="/images/aura_logo.svg"
          alt="Aura Logo"
          className="h-8 md:h-10 lg:h-12 xl:h-14"
          onClick={scrollToTop}
        />
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <a
        href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión <ArrowRightCircle size={18} />
        </a>
      </div>
    </nav>
  );
}
