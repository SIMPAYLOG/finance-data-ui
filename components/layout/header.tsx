import Link from "next/link";
import { BarChart3 } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/generate", label: "데이터 생성" },
  { href: "/analyze", label: "데이터 분석" },
  { href: "/settings", label: "설정" },
];

export const Header = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SIMPAYLOG</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};