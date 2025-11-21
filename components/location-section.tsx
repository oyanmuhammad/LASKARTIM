"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

export function LocationSection() {
  return (
    <section id="location" className="py-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lokasi <span className="text-primary">Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan kami di Desa Karang Baru Timur, Lombok Timur
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Map */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1474.471761513678!2d116.54772457961323!3d-8.5357589434768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcc490056139b45%3A0xd5ab28fb3abd3dfe!2sKANTOR%20DESA%20KARANG%20BARU%20TIMUR!5e1!3m2!1sid!2sid!4v1762082290306!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Desa Karang Baru Timur"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start gap-3 text-left">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Desa Karang Baru Timur
                </p>
                <p className="text-sm text-muted-foreground">
                  Kecamatan Wanasaba, Kabupaten Lombok Timur
                  <br />
                  Nusa Tenggara Barat, Indonesia
                </p>
              </div>
            </div>
            <Button
              size="default"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0 dark:hover:text-primary"
              asChild
            >
              <a
                href="https://maps.google.com/?q=Karang+Baru+Timur+Lombok+Timur"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka di Google Maps
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
