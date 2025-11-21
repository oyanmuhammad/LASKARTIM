"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, Shield, AlertCircle } from "lucide-react";
import { submitReportAction } from "@/app/actions/submit-report";
import { validateNIKAction } from "@/app/actions/validate-nik";
import { toast } from "sonner";

const categories = [
  { value: "INFRASTRUKTUR", label: "Infrastruktur" },
  { value: "SOSIAL", label: "Sosial" },
  { value: "LINGKUNGAN", label: "Lingkungan" },
  { value: "ADMINISTRASI", label: "Administrasi" },
  { value: "LAINNYA", label: "Lainnya" },
];

const locations = [
  { value: "DUSUN_KARANG_BARU_TIMUR", label: "Dusun Karang Baru Timur" },
  { value: "DUSUN_TAMPATAN", label: "Dusun Tampatan" },
  { value: "DUSUN_PAOK_DANGKA", label: "Dusun Paok Dangka" },
];

interface FormData {
  nik: string;
  kategori: string;
  lokasi: string;
  judul: string;
  isi: string;
}

export function HeroSection() {
  const [showForm, setShowForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [nikValidating, setNikValidating] = React.useState(false);
  const [nikError, setNikError] = React.useState<string | null>(null);
  const [nikName, setNikName] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState<FormData>({
    nik: "",
    kategori: "",
    lokasi: "",
    judul: "",
    isi: "",
  });

  const isFormValid =
    formData.nik.length === 16 &&
    !nikError &&
    nikName &&
    formData.kategori &&
    formData.lokasi &&
    formData.judul.trim().length > 0 &&
    formData.isi.length >= 10;

  // Validate NIK on blur
  const handleNIKBlur = async () => {
    if (formData.nik.length !== 16) {
      setNikError("NIK harus 16 digit");
      setNikName(null);
      return;
    }

    setNikValidating(true);
    setNikError(null);
    
    try {
      const result = await validateNIKAction(formData.nik);
      
      if (result.isValid && result.name) {
        setNikName(result.name);
        setNikError(null);
        toast.success(`NIK valid: ${result.name}`);
      } else {
        setNikError(result.error || "NIK tidak valid");
        setNikName(null);
        toast.error(result.error || "NIK tidak valid");
      }
    } catch {
      setNikError("Gagal memvalidasi NIK");
      setNikName(null);
    } finally {
      setNikValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const result = await submitReportAction({
        nik: formData.nik,
        category: formData.kategori,
        location: formData.lokasi,
        title: formData.judul,
        description: formData.isi,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message || "Laporan berhasil dikirim!");
        
        // Reset after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setShowForm(false);
          setFormData({ nik: "", kategori: "", lokasi: "", judul: "", isi: "" });
          setNikName(null);
          setNikError(null);
        }, 5000);
      } else {
        if (result.rateLimitMessage) {
          toast.error(result.rateLimitMessage);
        } else {
          toast.error(result.error || "Gagal mengirim laporan");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen px-6 lg:px-8">
      {/* Emerald Mist Background - Base */}
      <div className="absolute inset-0 bg-background -z-10" />

      {/* Light Mode Mist */}
      <div
        className="absolute inset-0 -z-10 opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(5, 150, 105, 0.10) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(6, 78, 59, 0.06) 0%, transparent 80%)
          `,
        }}
      />

      {/* Dark Mode Mist */}
      <div
        className="absolute inset-0 -z-10 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(5, 150, 105, 0.18) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(6, 78, 59, 0.12) 0%, transparent 80%)
          `,
        }}
      />

      <div className="container mx-auto max-w-4xl min-h-screen flex flex-col items-center py-16 md:py-24">
        {/* Hero Text - Tetap di posisi stabil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 flex-shrink-0 pt-20 md:pt-32"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Sampaikan Aspirasi Anda untuk{" "}
            <span className="text-primary">Karang Baru Timur</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Platform transparansi publik untuk menyampaikan aspirasi, keluhan,
            dan saran pembangunan desa yang lebih baik
          </p>

          {!showForm && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="default"
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/90 mt-4"
              >
                Kirim Aspirasi
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Form - Dengan spacing yang lebih baik */}
        <AnimatePresence>
          {showForm && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full mt-12 md:mt-16 pb-12 md:pb-16"
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Form Aspirasi Masyarakat</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* NIK */}
                    <div className="space-y-2">
                      <Label htmlFor="nik">
                        NIK (16 Digit){" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="nik"
                          type="text"
                          maxLength={16}
                          value={formData.nik}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, nik: value });
                            setNikError(null);
                            setNikName(null);
                          }}
                          onBlur={handleNIKBlur}
                          placeholder="Masukkan 16 digit NIK"
                          className={nikError ? "border-destructive" : nikName ? "border-green-500" : ""}
                          required
                          disabled={nikValidating}
                        />
                        {nikValidating && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formData.nik.length}/16 digit
                        </p>
                        {nikName && (
                          <p className="text-xs text-green-600 font-medium">
                            ✓ {nikName}
                          </p>
                        )}
                      </div>
                      {nikError && (
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-xs">{nikError}</p>
                        </div>
                      )}
                    </div>

                    {/* Kategori */}
                    <div className="space-y-2">
                      <Label htmlFor="kategori">
                        Kategori <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.kategori}
                        onValueChange={(value) =>
                          setFormData({ ...formData, kategori: value })
                        }
                      >
                        <SelectTrigger id="kategori">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Lokasi */}
                    <div className="space-y-2">
                      <Label htmlFor="lokasi">
                        Lokasi <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.lokasi}
                        onValueChange={(value) =>
                          setFormData({ ...formData, lokasi: value })
                        }
                      >
                        <SelectTrigger id="lokasi">
                          <SelectValue placeholder="Pilih lokasi" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.value} value={loc.value}>
                              {loc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Judul Laporan */}
                    <div className="space-y-2">
                      <Label htmlFor="judul">
                        Judul Laporan <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="judul"
                        type="text"
                        maxLength={50}
                        value={formData.judul}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                          setFormData({ ...formData, judul: value });
                        }}
                        placeholder="Ringkasan singkat laporan Anda"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.judul.length}/50 karakter (hanya huruf, angka, dan spasi)
                      </p>
                    </div>

                    {/* Isi Laporan */}
                    <div className="space-y-2">
                      <Label htmlFor="isi">
                        Isi Laporan <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="isi"
                        value={formData.isi}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                          setFormData({ ...formData, isi: value });
                        }}
                        placeholder="Sampaikan aspirasi, keluhan, atau saran Anda (minimal 10 karakter)"
                        className="min-h-[120px] resize-y"
                        maxLength={500}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.isi.length}/500 karakter (minimal 10, hanya huruf, angka, dan spasi)
                      </p>
                    </div>

                    {/* Privacy Note */}
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-md border border-primary/20">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Data NIK dijamin aman dan digunakan hanya untuk
                        verifikasi.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      size="sm"
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        "Kirim Aspirasi"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-12 md:mt-16 pb-12 md:pb-16"
            >
              <Card className="max-w-md mx-auto text-center border-primary">
                <CardContent className="pt-6 pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Terima Kasih!</h3>
                  <p className="text-muted-foreground">
                    Aspirasi Anda telah berhasil dikirim dan akan segera kami
                    tindaklanjuti.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
