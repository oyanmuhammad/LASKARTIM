"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Bapak Udin",
    location: "Warga Karang Baru",
    text: "Platform ini sangat membantu kami menyampaikan keluhan infrastruktur jalan. Responnya cepat dan transparan.",
  },
  {
    name: "Ibu Siti",
    location: "Dusun Tampatan",
    text: "Dengan LASKARTIM, saya merasa lebih dekat dengan pemerintah desa. Aspirasi kami benar-benar didengar.",
  },
  {
    name: "Bapak Mail",
    location: "Karang Baru Timur",
    text: "Sistem yang mudah digunakan. Harapan saya pembangunan desa semakin baik dengan adanya platform ini.",
  },
  {
    name: "Ibu Aisyah",
    location: "Paok Dangka",
    text: "Terima kasih LASKARTIM, sekarang tidak perlu datang langsung ke kantor desa untuk menyampaikan keluhan.",
  },
  {
    name: "Bapak Hifzi",
    location: "Warga Karang Baru Timur",
    text: "Transparansi yang luar biasa. Saya bisa melihat bagaimana aspirasi saya ditindaklanjuti dengan jelas.",
  },
];

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Testimoni <span className="text-primary">Masyarakat</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman warga yang telah menggunakan layanan LASKARTIM
          </p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Card className="border-border">
            <CardContent className="pt-8 pb-8 px-6 md:px-12 min-h-[280px] flex flex-col justify-center">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <p className="text-lg md:text-xl text-foreground italic leading-relaxed h-24 md:h-20 flex items-center justify-center">
                  &ldquo;{testimonials[currentIndex].text}&rdquo;
                </p>
                <div className="pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].location}
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="p-2 touch-manipulation"
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-primary/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
