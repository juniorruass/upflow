"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/app", label: "Início" },
  { href: "/app/connect", label: "Conectar WhatsApp" },
  { href: "/app/crm", label: "CRM" },
  { href: "/app/flows", label: "Fluxos" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

export default function Header({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();
  const initial = userEmail?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-semibold text-text-primary">UpFlow</span>
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`border-b-2 pb-1 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "border-accent-bright text-text-primary"
                      : "border-transparent text-text-dim hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated-2 font-body text-sm font-medium text-text-primary">
          {initial}
        </span>
      </div>
    </header>
  );
}
