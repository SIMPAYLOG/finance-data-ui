import { BarChart3 } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BarChart3 className="h-6 w-6" />
          <span className="text-xl font-bold">SIMPAYLOG</span>
        </div>
        <p className="text-gray-400">
          © {currentYear} SIMPAYLOG. All rights reserved.
        </p>
      </div>
    </footer>
  );
};