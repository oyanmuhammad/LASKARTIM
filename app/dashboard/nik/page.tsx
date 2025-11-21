"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Calendar,
  Search,
  Plus,
  Edit,
  UserX,
} from "lucide-react";
import { getNIKRecordsAction } from "@/app/actions/admin/get-nik-records";
import { addNIKAction } from "@/app/actions/admin/add-nik";
import { updateNIKAction } from "@/app/actions/admin/update-nik";
import { deactivateNIKAction } from "@/app/actions/admin/deactivate-nik";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const formatDate = (isoDate: string | Date) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
  ) : (
    <Badge variant="secondary">Nonaktif</Badge>
  );
};

interface NIKRecord {
  nik: string;
  name: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    reports: number;
  };
}

export default function NIKManagementPage() {
  const [nikRecords, setNikRecords] = useState<NIKRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedNIK, setSelectedNIK] = useState<NIKRecord | null>(null);
  const [formData, setFormData] = useState({ nik: "", name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [totalNIK, setTotalNIK] = useState(0);
  const [totalActiveNIK, setTotalActiveNIK] = useState(0);
  const [cardLoading, setCardLoading] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch card data (total counts) - ONLY ONCE on mount
  useEffect(() => {
    async function fetchCardData() {
      setCardLoading(true);
      try {
        const result = await getNIKRecordsAction({
          page: 1,
          limit: 1, // Just fetch 1 item, we only need the counts
          searchQuery: '',
        });
        
        setTotalNIK(result.total);
        setTotalActiveNIK(result.totalActive);
      } catch (error) {
        console.error("Error fetching card data:", error);
        toast.error("Gagal memuat statistik NIK");
      } finally {
        setCardLoading(false);
      }
    }
    fetchCardData();
  }, []); // Empty dependency - only run once!

  // Fetch table data with server-side pagination
  useEffect(() => {
    async function fetchTableData() {
      setLoading(true);
      try {
        const result = await getNIKRecordsAction({
          page: currentPage,
          limit: 10, // Fetch 10 items per page
          searchQuery: debouncedSearchQuery,
        });
        
        setNikRecords(result.nikRecords);
        
        // Calculate total pages based on filtered results
        const itemsCount = debouncedSearchQuery ? result.nikRecords.length : result.total;
        setTotalPages(Math.ceil(itemsCount / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching NIK records:", error);
        toast.error("Gagal memuat data NIK");
      } finally {
        setLoading(false);
      }
    }
    fetchTableData();
  }, [currentPage, debouncedSearchQuery]);

  const handleAddNIK = () => {
    setDialogMode("add");
    setFormData({ nik: "", name: "" });
    setSelectedNIK(null);
    setIsDialogOpen(true);
  };

  const handleEditNIK = (record: NIKRecord) => {
    setDialogMode("edit");
    setFormData({ nik: record.nik, name: record.name });
    setSelectedNIK(record);
    setIsDialogOpen(true);
  };

  const handleSubmitDialog = async () => {
    setSubmitting(true);
    try {
      if (dialogMode === "add") {
        const result = await addNIKAction(formData.nik, formData.name);
        if (result.success && result.nikRecord) {
          toast.success(result.message);
          setNikRecords([result.nikRecord, ...nikRecords]);
          // Update card counts
          setTotalNIK(totalNIK + 1);
          if (result.nikRecord.isActive) {
            setTotalActiveNIK(totalActiveNIK + 1);
          }
          setIsDialogOpen(false);
        } else {
          toast.error(result.error);
        }
      } else if (dialogMode === "edit" && selectedNIK) {
        const result = await updateNIKAction(selectedNIK.nik, formData.name);
        if (result.success) {
          toast.success(result.message);
          setNikRecords(nikRecords.map(n => 
            n.nik === selectedNIK.nik ? { ...n, name: formData.name, updatedAt: new Date() } : n
          ));
          setIsDialogOpen(false);
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      console.error("Error submitting NIK:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (nik: string, currentStatus: boolean) => {
    if (currentStatus) {
      // Deactivate
      const result = await deactivateNIKAction(nik);
      if (result.success) {
        toast.success(result.message);
        setNikRecords(nikRecords.map(n => 
          n.nik === nik ? { ...n, isActive: false, updatedAt: new Date() } : n
        ));
        // Update card count (active NIK decreased)
        setTotalActiveNIK(totalActiveNIK - 1);
      } else {
        toast.error(result.error);
      }
    } else {
      toast.info("Untuk mengaktifkan kembali, gunakan tombol Edit");
    }
  };

  // Server already paginated, no need to slice again!
  const paginatedNIKs = nikRecords;

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manajemen NIK</h1>
          <p className="text-muted-foreground">
            Kelola database NIK untuk validasi pengajuan aspirasi
          </p>
        </div>
        <Button 
          onClick={handleAddNIK} 
          className="gap-2"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          Tambah NIK
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {cardLoading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  totalActiveNIK
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                NIK Aktif
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {cardLoading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
                ) : (
                  totalNIK
                )}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1">
                Total NIK
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari berdasarkan NIK atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
      </div>

      {/* NIK Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableCaption className="py-4 text-muted-foreground">
            Daftar NIK terdaftar untuk validasi aspirasi
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px] font-semibold">NIK</TableHead>
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="w-[120px] text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="w-[180px] font-semibold">
                Terakhir Diubah
              </TableHead>
              <TableHead className="w-[180px] text-center font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="py-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full mx-auto"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedNIKs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Tidak ada NIK
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Belum ada NIK yang sesuai dengan pencarian
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedNIKs.map((record) => (
                <TableRow
                  key={record.nik}
                  className="hover:bg-muted/30 transition-colors duration-200"
                >
                  <TableCell className="py-4">
                    <span className="text-sm font-mono font-medium">
                      {record.nik}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium">{record.name}</span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {getStatusBadge(record.isActive)}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 opacity-50" />
                      <span>{formatDate(record.updatedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNIK(record)}
                        className="gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant={record.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() =>
                          handleToggleStatus(record.nik, record.isActive)
                        }
                        className={
                          record.isActive
                            ? "gap-1 text-destructive hover:text-destructive"
                            : "gap-1"
                        }
                      >
                        <UserX className="h-3.5 w-3.5" />
                        {record.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    </div>
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
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              hingga{" "}
              <span className="text-foreground font-semibold">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalNIK)}
              </span>{" "}
              dari{" "}
              <span className="text-foreground font-semibold">
                {totalNIK}
              </span>{" "}
              NIK
            </p>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Tambah NIK Baru" : "Edit NIK"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "add"
                ? "Masukkan NIK dan nama untuk menambahkan ke database"
                : "Ubah nama untuk NIK yang dipilih"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK (16 digit)</Label>
              <Input
                id="nik"
                placeholder="1234567890123456"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                disabled={dialogMode === "edit"}
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleSubmitDialog} disabled={submitting}>
              {submitting ? "Menyimpan..." : dialogMode === "add" ? "Tambah" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
