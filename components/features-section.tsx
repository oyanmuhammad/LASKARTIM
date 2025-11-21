"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Zap, ClipboardCheck } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Transparansi Publik",
    description:
      "Setiap aspirasi tercatat dan dapat dipantau prosesnya secara terbuka untuk membangun kepercayaan masyarakat.",
  },
  {
    icon: Zap,
    title: "Pelaporan Cepat",
    description:
      "Sampaikan aspirasi kapan saja dan di mana saja melalui platform digital yang mudah diakses.",
  },
  {
    icon: ClipboardCheck,
    title: "Aspirasi Terkelola dengan Baik",
    description:
      "Sistem terorganisir memastikan setiap aspirasi ditindaklanjuti dengan efektif dan efisien.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fitur <span className="text-primary">Unggulan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Platform ini dirancang untuk memudahkan masyarakat dalam
            menyampaikan aspirasi dan meningkatkan tata kelola desa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
