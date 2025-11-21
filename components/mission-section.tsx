"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function MissionSection() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Misi <span className="text-primary">Kami</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
            Kami berkomitmen untuk menciptakan{" "}
            <span className="font-semibold text-primary">
              transparansi penuh
            </span>{" "}
            dalam tata kelola pemerintahan desa. Melalui platform LASKARTIM,
            kami membuka ruang partisipasi aktif masyarakat dalam pembangunan
            dan pengambilan keputusan. Setiap suara warga adalah prioritas kami,
            dan bersama-sama kita wujudkan{" "}
            <span className="font-semibold text-primary">
              Karang Baru Timur yang lebih maju, demokratis, dan sejahtera
            </span>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
