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
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  FileText,
  Settings,
  CheckCircle2,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { getPublicReportsAction } from "@/app/actions/get-public-reports";

interface PublicReport {
  id: string;
  createdAt: string;
  category: string;
  location: string;
  title: string;
  description: string;
  status: string;
}

const ITEMS_PER_PAGE = 10;

const formatDate = (isoDate: string | Date) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatLocation = (location: string) => {
  return location
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const mapStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'DRAFT': 'Draft',
    'IN_PROGRESS': 'Diproses',
    'COMPLETED': 'Diselesaikan',
  };
  return statusMap[status] || status;
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



interface SelectedAspiration {
  id: string;
  createdAt: string;
  category: string;
  location: string;
  title: string;
  description: string;
  status: string;
}

export default function AspirasiPage() {
  const [aspirations, setAspirations] = useState<PublicReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    draft: 0,
    inProgress: 0,
    completed: 0,
  });
  const [selectedAspiration, setSelectedAspiration] =
    useState<SelectedAspiration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const result = await getPublicReportsAction({ pageSize: 1000 });

        if (result.reports) {
          setAspirations(result.reports);
          
          const draft = result.reports.filter((r) => r.status === "DRAFT").length;
          const inProgress = result.reports.filter((r) => r.status === "IN_PROGRESS").length;
          const completed = result.reports.filter((r) => r.status === "COMPLETED").length;
          
          setStats({
            draft,
            inProgress,
            completed,
          });
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const handleViewDetail = (aspiration: PublicReport) => {
    setSelectedAspiration({
      id: aspiration.id,
      createdAt: aspiration.createdAt,
      category: aspiration.category,
      location: aspiration.location,
      title: aspiration.title,
      description: aspiration.description,
      status: mapStatus(aspiration.status),
    });
    setIsDialogOpen(true);
  };

  // Filter dan sort data menggunakan useMemo untuk performa
  const filteredAndSortedAspirations = useMemo(() => {
    let result = [...aspirations];

    // Filter berdasarkan status
    if (filterStatus !== "all") {
      const statusMap: { [key: string]: string } = {
        'Draft': 'DRAFT',
        'Diproses': 'IN_PROGRESS',
        'Diselesaikan': 'COMPLETED',
      };
      const dbStatus = statusMap[filterStatus];
      result = result.filter((item) => item.status === dbStatus);
    }

    // Sort berdasarkan pilihan
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [aspirations, filterStatus, sortBy]);

  // Hitung pagination values
  const totalPages = Math.ceil(
    filteredAndSortedAspirations.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAspirations = filteredAndSortedAspirations.slice(
    startIndex,
    endIndex
  );

  // Generate pagination items untuk tampilan nomor halaman
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

  // Handler filter dan sort yang reset ke halaman 1
  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header with Breadcrumb and Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Aspirasi</span>
        </nav>
        <ModeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Aspirasi Masyarakat</h1>
        <p className="text-muted-foreground">
          Daftar aspirasi dan laporan dari masyarakat Laskar Tim
        </p>
      </div>

      {/* Statistik Cards - Dipindahkan ke atas */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.draft
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
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.inProgress
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Diproses
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.completed
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Diselesaikan
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
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
                Tarlama
              </SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-muted-foreground">
            Daftar aspirasi masyarakat yang telah masuk
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[120px] font-semibold">Tanggal</TableHead>
              <TableHead className="font-semibold">Kategori</TableHead>
              <TableHead className="font-semibold">Lokasi</TableHead>
              <TableHead className="min-w-[300px] font-semibold">
                Judul Laporan
              </TableHead>
              <TableHead className="text-center font-semibold">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="py-4">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full mx-auto"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedAspirations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Tidak ada aspirasi
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Belum ada aspirasi yang sesuai dengan filter yang
                        dipilih
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAspirations.map((aspiration) => (
                <TableRow
                  key={aspiration.id}
                  className="hover:bg-muted/30 transition-colors duration-200 group cursor-pointer"
                  onClick={() => handleViewDetail(aspiration)}
                >
                  <TableCell className="font-medium text-muted-foreground py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 opacity-50" />
                      <span>{formatDate(aspiration.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {aspiration.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium">
                      {formatLocation(aspiration.location)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(aspiration);
                      }}
                      className="text-sm font-medium hover:text-primary transition-colors text-left hover:underline"
                    >
                      {aspiration.title}
                    </button>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {getStatusBadge(mapStatus(aspiration.status))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
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
              <span className="text-foreground font-semibold">
                {currentPage}
              </span>{" "}
              dari{" "}
              <span className="text-foreground font-semibold">
                {totalPages}
              </span>{" "}
              • Menampilkan{" "}
              <span className="text-foreground font-semibold">
                {startIndex + 1}
              </span>{" "}
              hingga{" "}
              <span className="text-foreground font-semibold">
                {Math.min(endIndex, filteredAndSortedAspirations.length)}
              </span>{" "}
              dari{" "}
              <span className="text-foreground font-semibold">
                {filteredAndSortedAspirations.length}
              </span>{" "}
              aspirasi
            </p>
          </div>
        </div>
      )}

      {/* Dialog untuk Detail Laporan */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Detail Aspirasi
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap aspirasi masyarakat
            </DialogDescription>
          </DialogHeader>
          {selectedAspiration && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Tanggal
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {formatDate(selectedAspiration.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedAspiration.status)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Kategori
                </p>
                <p className="text-base font-semibold text-primary">
                  {selectedAspiration.category}
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Lokasi
                </p>
                <p className="text-base font-semibold text-foreground">
                  {formatLocation(selectedAspiration.location)}
                </p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Judul Laporan
                </p>
                <p className="text-lg font-semibold text-primary">
                  {selectedAspiration.title}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  Deskripsi Lengkap
                </p>
                <div className="bg-muted/50 p-5 rounded-lg border border-border">
                  <p className="text-base leading-relaxed text-foreground">
                    {selectedAspiration.description}
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
