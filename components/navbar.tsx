"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Home", href: "#hero" },
  { label: "Tentang", href: "#profile" },
  { label: "Fitur", href: "#features" },
  { label: "Lokasi", href: "#location" },
  { label: "Kontak", href: "#footer" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileMenuLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-800 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="#hero"
            className="text-lg font-bold text-primary hover:text-primary/90 transition-colors"
            aria-label="LASKARTIM Home"
          >
            LASKARTIM
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button
                size="sm"
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="/aspirasi">Lihat Aspirasi</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-b border-border pointer-events-auto"
            style={{ position: "relative", zIndex: 40 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleMobileMenuLinkClick}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
              <Button
                size="sm"
                asChild
                className="w-full bg-primary hover:bg-primary/90 mt-2"
              >
                <Link href="/aspirasi" onClick={handleMobileMenuLinkClick}>
                  Lihat Aspirasi
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
