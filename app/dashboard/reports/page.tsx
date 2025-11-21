"use client";

import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Calendar,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { getReportsAction } from "@/app/actions/admin/get-reports";
import { updateReportStatusAction } from "@/app/actions/admin/update-report-status";
import { toast } from "sonner";
import type { ReportStatus } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

const formatDate = (isoDate: Date | string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Format location for display (e.g., DUSUN_PAOK_DANGKA -> Dusun Paok Dangka)
const formatLocation = (location: string) => {
  return location
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Map database status to display status
const mapStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    DRAFT: "Draft",
    IN_PROGRESS: "Diproses",
    COMPLETED: "Diselesaikan",
  };
  return statusMap[status] || status;
};

// Map display status to database status
const mapStatusToDb = (status: string): ReportStatus => {
  const statusMap: { [key: string]: ReportStatus } = {
    "Draft": "DRAFT",
    "Diproses": "IN_PROGRESS",
    "Diselesaikan": "COMPLETED",
  };
  return statusMap[status] || "DRAFT";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Draft":
      return <Badge variant="secondary">{status}</Badge>;
    case "Diproses":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    case "Diselesaikan":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

interface Report {
  id: string;
  createdAt: string;
  nik: string;
  title: string;
  category: string;
  location: string;
  description: string;
  status: string;
  updatedAt: string;
  nikRecord: {
    name: string;
  } | null;
}

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const result = await getReportsAction({ pageSize: 1000 }); 
        setReports(result.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("Gagal memuat laporan");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    const dbStatus = mapStatusToDb(newStatus);
    const result = await updateReportStatusAction(reportId, dbStatus);
    
    if (result.success) {
      toast.success(result.message);
      // Update local state
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, status: dbStatus } : r
      ));
    } else {
      toast.error(result.error);
    }
  };

  // Filter, search, and sort data
  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Search by NIK, name, title, lokasi, or description
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.nik.includes(query) ||
          (item.nikRecord?.name.toLowerCase().includes(query) ?? false) ||
          item.title.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      const dbStatus = mapStatusToDb(filterStatus);
      result = result.filter((item) => item.status === dbStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [reports, filterStatus, sortBy, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = filteredAndSortedReports.slice(startIndex, endIndex);

  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    const maxPages = 5;
    const halfMax = Math.floor(maxPages / 2);

    let startPage = Math.max(1, currentPage - halfMax);
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) {
        items.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push("...");
      }
      items.push(totalPages);
    }

    return items;
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Manajemen Laporan</h1>
        <p className="text-muted-foreground">
          Kelola dan ubah status laporan aspirasi masyarakat
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  reports.filter((r) => r.status === "DRAFT").length
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Draft
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  reports.filter((r) => r.status === "IN_PROGRESS").length
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Diproses
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  reports.filter((r) => r.status === "COMPLETED").length
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Diselesaikan
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berdasarkan NIK, nama, judul, lokasi, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block text-foreground">
              Filter Status
            </label>
            <Select 
              value={filterStatus} 
              onValueChange={handleFilterChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Diproses">Diproses</SelectItem>
                <SelectItem value="Diselesaikan">Diselesaikan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block text-foreground">
              <ArrowUpDown className="h-4 w-4 inline mr-1" />
              Urutkan
            </label>
            <Select 
              value={sortBy} 
              onValueChange={handleSortChange}
              disabled={loading}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Terbaru
                </SelectItem>
                <SelectItem value="date-asc">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Terlama
                </SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-muted-foreground">
            Daftar laporan aspirasi dari masyarakat
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[110px] font-semibold">Tanggal</TableHead>
              <TableHead className="w-[140px] font-semibold">NIK</TableHead>
              <TableHead className="w-[140px] font-semibold">Nama</TableHead>
              <TableHead className="w-[280px] font-semibold">Judul</TableHead>
              <TableHead className="w-[180px] font-semibold">Lokasi</TableHead>
              <TableHead className="w-[140px] text-center font-semibold">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="py-3">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-28 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-36 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="h-8 w-full bg-muted animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Tidak ada laporan
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Belum ada laporan yang sesuai dengan filter yang dipilih
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-muted/30 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-muted-foreground py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 opacity-50" />
                      <span className="text-xs">{formatDate(report.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-mono">{report.nik}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm font-medium">{report.nikRecord?.name || 'N/A'}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <button
                      onClick={() => handleViewDetail(report)}
                      className="text-sm font-medium hover:text-primary transition-colors text-left hover:underline"
                    >
                      {report.title}
                    </button>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm">{formatLocation(report.location)}</span>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <Select
                      value={mapStatus(report.status)}
                      onValueChange={(value) => handleStatusChange(report.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">
                          <Badge variant="secondary">Draft</Badge>
                        </SelectItem>
                        <SelectItem value="Diproses">
                          <Badge className="bg-blue-500">Diproses</Badge>
                        </SelectItem>
                        <SelectItem value="Diselesaikan">
                          <Badge className="bg-green-500">Diselesaikan</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={
                    currentPage === 1
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-muted transition-colors"
                  }
                />
              </PaginationItem>

              {getPaginationItems().map((page, index) => (
                <PaginationItem key={index}>
                  {typeof page === "string" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page as number)}
                      className="cursor-pointer hover:bg-muted transition-colors"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-muted transition-colors"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="px-4 py-2 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground font-medium">
              Halaman{" "}
              <span className="text-foreground font-semibold">{currentPage}</span>{" "}
              dari{" "}
              <span className="text-foreground font-semibold">{totalPages}</span> •
              Menampilkan{" "}
              <span className="text-foreground font-semibold">
                {startIndex + 1}
              </span>{" "}
              hingga{" "}
              <span className="text-foreground font-semibold">
                {Math.min(endIndex, filteredAndSortedReports.length)}
              </span>{" "}
              dari{" "}
              <span className="text-foreground font-semibold">
                {filteredAndSortedReports.length}
              </span>{" "}
              laporan
            </p>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Detail Laporan
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap laporan aspirasi
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Tanggal
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {formatDate(selectedReport.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Status
                  </p>
                  <div className="mt-1">{getStatusBadge(mapStatus(selectedReport.status))}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    NIK
                  </p>
                  <p className="text-base font-mono font-semibold text-foreground">
                    {selectedReport.nik}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Nama Warga
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {selectedReport.nikRecord?.name || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Judul
                  </p>
                  <p className="text-base font-semibold text-primary">
                    {selectedReport.title}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Lokasi
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {formatLocation(selectedReport.location)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  Deskripsi Lengkap
                </p>
                <div className="bg-muted/50 p-5 rounded-lg border border-border">
                  <p className="text-base leading-relaxed text-foreground">
                    {selectedReport.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
