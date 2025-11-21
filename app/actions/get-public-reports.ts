'use server'

import { db } from "@/lib/db"

export interface PublicReport {
  id: string
  createdAt: string
  category: string
  location: string
  title: string
  description: string
  status: string
}

export interface GetPublicReportsResult {
  reports: PublicReport[]
  total: number
  pagination: {
    page: number
    pageSize: number
    totalPages: number
  }
}

export async function getPublicReportsAction(params?: {
  page?: number
  pageSize?: number
  status?: string
}): Promise<GetPublicReportsResult> {
  const page = params?.page || 1
  const pageSize = params?.pageSize || 1000
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = db
    .from('Report')
    .select('id, createdAt, category, location, title, description, status', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range(from, to)

  if (params?.status && params.status !== 'all') {
    const statusMap: { [key: string]: string } = {
      'Draft': 'DRAFT',
      'Diproses': 'IN_PROGRESS',
      'Diselesaikan': 'COMPLETED',
    }
    query = query.eq('status', statusMap[params.status] || params.status)
  }

  const { data: reports, error, count } = await query

  if (error) {
    console.error('Error fetching reports:', error)
    return {
      reports: [],
      total: 0,
      pagination: { page, pageSize, totalPages: 0 },
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / pageSize)

  return {
    reports: reports || [],
    total,
    pagination: {
      page,
      pageSize,
      totalPages,
    },
  }
}
