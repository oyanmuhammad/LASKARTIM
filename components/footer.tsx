"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { CurrentYear } from "./current-year";

const quickLinks = [
  { label: "Tentang", href: "#profile" },
  { label: "Fitur", href: "#features" },
  { label: "Kontak", href: "#footer" },
  { label: "Kebijakan Privasi", href: "#" },
];

const socialMedia = [
  {
    icon: Facebook,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: Mail,
    href: "mailto:info@karangbarutimur.desa.id",
    label: "Email",
  },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">LASKARTIM</h3>
            <p className="text-sm text-muted-foreground">
              Layanan Aspirasi Karang Baru Timur untuk mewujudkan desa yang
              lebih transparan, demokratis, dan sejahtera.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Tautan Cepat</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.href === "#" ? (
                    <span className="text-sm text-muted-foreground cursor-default">
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  Desa Karang Baru Timur, Kec. Wanasaba, Lombok Timur, NTB
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+62 xxx xxxx xxxx</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@karangbarutimur.desa.id</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {socialMedia.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            &copy; <Suspense fallback="2025"><CurrentYear /></Suspense> LASKARTIM - Desa Karang Baru
            Timur.
          </p>
          <p>
            <Link
              href="https://instagram.com/kkn.karangbarutimur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-colors"
            >
              Dipersembahkan oleh KKN 31 Universitas Hamzanwadi.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
