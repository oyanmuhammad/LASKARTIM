"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle2, Settings } from "lucide-react";
import Link from "next/link";
import { getReportsAction } from "@/app/actions/admin/get-reports";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalReports: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const reportsResult = await getReportsAction({ pageSize: 10000 });
        const totalReports = reportsResult.reports.length;
        const inProgress = reportsResult.reports.filter(r => r.status === "IN_PROGRESS").length;
        const completed = reportsResult.reports.filter(r => r.status === "COMPLETED").length;

        setStats({
          totalReports,
          inProgress,
          completed,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Dashboard Administrator</h1>
        <p className="text-muted-foreground">
          Kelola laporan aspirasi dan data NIK masyarakat
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{stats.totalReports}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  Total Laporan
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{stats.inProgress}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  Diproses
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  Diselesaikan
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/reports">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kelola Laporan</CardTitle>
                  <CardDescription>
                    Lihat, filter, dan ubah status laporan aspirasi
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Akses halaman manajemen laporan untuk mengubah status, mencari, dan memfilter laporan berdasarkan status atau tanggal.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/nik">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kelola NIK</CardTitle>
                  <CardDescription>
                    Tambah, edit, dan kelola data NIK warga
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Kelola database NIK untuk validasi pengajuan aspirasi. Tambah NIK baru atau nonaktifkan NIK yang tidak valid.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
