'use server'

import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

type ReportStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

export interface GetReportsParams {
  search?: string
  status?: ReportStatus | 'ALL'
  dateFrom?: Date
  dateTo?: Date
  page?: number
  pageSize?: number
}

export interface GetReportsResult {
  reports: Array<{
    id: string
    nik: string
    title: string
    category: string
    location: string
    description: string
    status: string
    createdAt: string
    updatedAt: string
    nikRecord: {
      name: string
    } | null
  }>
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function getReportsAction(
  params: GetReportsParams = {}
): Promise<GetReportsResult> {
  const session = await getSession()
  if (!session?.user) {
    redirect('/login')
  }

  const {
    search = '',
    status = 'ALL',
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 10,
  } = params

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = db
    .from('Report')
    .select('*, NIKRecord!inner(name)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range(from, to)

  if (status !== 'ALL') {
    query = query.eq('status', status)
  }

  if (dateFrom) {
    query = query.gte('createdAt', dateFrom.toISOString())
  }

  if (dateTo) {
    const endOfDay = new Date(dateTo)
    endOfDay.setHours(23, 59, 59, 999)
    query = query.lte('createdAt', endOfDay.toISOString())
  }

  if (search && search.trim() !== '') {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%,nik.like.%${search}%`)
  }

  const { data: reports, error, count } = await query

  if (error) {
    console.error('Error fetching reports:', error)
    return {
      reports: [],
      pagination: { page, pageSize, total: 0, totalPages: 0 },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / pageSize)

  interface ReportWithNIK {
    id: string;
    nik: string;
    title: string;
    category: string;
    location: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    NIKRecord?: { name: string } | null;
  }

  const formattedReports = (reports || []).map((report: ReportWithNIK) => ({
    ...report,
    nikRecord: report.NIKRecord ? { name: report.NIKRecord.name } : null,
  }))

  return {
    reports: formattedReports,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  }
}
