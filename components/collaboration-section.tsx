"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function CollaborationSection() {
  return (
    <section className="py-16 px-6 lg:px-8 bg-muted/50 dark:bg-muted/30">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
            Dipersembahkan oleh
            <br />
            <span className="text-primary">Desa Karang Baru Timur</span>
            <br />
            Bersama <span className="text-primary">KKN Kelompok 31</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Kolaborasi antara masyarakat dan staf desa Karang Baru Timur dengan
            mahasiswa KKN 31 Fakultas Teknik Universitas Hamzanwadi untuk
            menciptakan transparansi dan kemudahan akses layanan publik.
          </p>
          <Button
            size="default"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white dark:hover:text-primary"
            asChild
          >
            <a
              href="https://karangbarutimur.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website Utama
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
