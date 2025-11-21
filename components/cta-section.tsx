"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const scrollToHero = () => {
    const element = document.querySelector("#hero");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Sampaikan Aspirasi Anda untuk{" "}
            <span className="text-primary">Desa yang Lebih Baik</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Setiap suara Anda penting. Mari bersama-sama membangun Karang Baru
            Timur yang lebih maju dan sejahtera.
          </p>
          <Button
            size="default"
            onClick={scrollToHero}
            className="bg-primary hover:bg-primary/90 mt-4"
          >
            Kirim Aspirasi Sekarang
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
