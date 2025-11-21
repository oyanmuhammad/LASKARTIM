"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu LASKARTIM?",
    answer:
      "LASKARTIM (Layanan Aspirasi Karang Baru Timur) adalah platform digital yang memungkinkan masyarakat Desa Karang Baru Timur untuk menyampaikan aspirasi, keluhan, dan saran terkait pembangunan dan pelayanan publik secara transparan dan terorganisir.",
  },
  {
    question: "Siapa yang bisa menggunakan layanan ini?",
    answer:
      "Seluruh warga Desa Karang Baru Timur yang memiliki NIK (Nomor Induk Kependudukan) dapat menggunakan layanan ini. Data NIK hanya digunakan untuk verifikasi dan dijamin keamanannya.",
  },
  {
    question: "Bagaimana cara menyampaikan aspirasi?",
    answer:
      "Anda dapat menyampaikan aspirasi dengan mengklik tombol 'Kirim Aspirasi', kemudian mengisi formulir yang tersedia dengan NIK, kategori aspirasi, lokasi, dan isi laporan. Setelah terisi lengkap, klik tombol 'Kirim Aspirasi' untuk mengirimkan.",
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Ya, semua data yang Anda sampaikan dijamin aman dan hanya digunakan untuk keperluan verifikasi dan tindak lanjut aspirasi. Kami berkomitmen menjaga privasi dan keamanan data masyarakat.",
  },
  {
    question: "Berapa lama waktu pemrosesan aspirasi?",
    answer:
      "Setiap aspirasi akan diverifikasi dan ditindaklanjuti sesegera mungkin. Waktu pemrosesan tergantung pada jenis dan tingkat kompleksitas aspirasi yang disampaikan. Anda dapat memantau status aspirasi Anda melalui platform ini.",
  },
  {
    question: "Apakah ada biaya untuk menggunakan layanan ini?",
    answer:
      "Tidak, layanan LASKARTIM sepenuhnya gratis dan dapat diakses oleh seluruh warga Desa Karang Baru Timur tanpa dipungut biaya apapun.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pertanyaan <span className="text-primary">Umum</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering diajukan tentang
            LASKARTIM
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-background"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
