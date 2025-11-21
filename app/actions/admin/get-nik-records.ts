'use server'

import { cache } from 'react'
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export interface GetNIKRecordsResult {
  nikRecords: Array<{
    nik: string
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    _count: {
      reports: number
    }
  }>
  total: number
  totalActive: number
  hasMore: boolean
}

interface GetNIKRecordsParams {
  page?: number
  limit?: number
  searchQuery?: string
}

// Cache the total and active counts (these don't change often)
const getCounts = cache(async () => {
  const { count: totalCount } = await db
    .from('NIKRecord')
    .select('*', { count: 'exact', head: true })

  const { count: activeCount } = await db
    .from('NIKRecord')
    .select('*', { count: 'exact', head: true })
    .eq('isActive', true)

  return { totalCount: totalCount || 0, activeCount: activeCount || 0 }
})

export async function getNIKRecordsAction(params: GetNIKRecordsParams = {}): Promise<GetNIKRecordsResult> {
  const session = await getSession()
  if (!session?.user) {
    redirect('/login')
  }

  const { page = 1, limit = 50, searchQuery = '' } = params

  // Calculate range for pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Get cached counts
  const { totalCount, activeCount } = await getCounts()

  // Build query with search filter
  let query = db
    .from('NIKRecord')
    .select('*', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range(from, to)

  // Apply search filter if provided
  if (searchQuery) {
    query = query.or(`nik.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
  }

  const { data: nikRecords, error, count: filteredCount } = await query

  if (error) {
    console.error('Error fetching NIK records:', error)
    return {
      nikRecords: [],
      total: totalCount,
      totalActive: activeCount,
      hasMore: false,
    }
  }

  // Get report counts only for fetched NIKs (efficient!)
  const nikList = (nikRecords || []).map((record: { nik: string }) => record.nik)
  
  const { data: reportCounts } = await db
    .from('Report')
    .select('nik')
    .in('nik', nikList)

  // Count reports per NIK
  const reportCountMap = new Map<string, number>()
  reportCounts?.forEach((report: { nik: string }) => {
    const currentCount = reportCountMap.get(report.nik) || 0
    reportCountMap.set(report.nik, currentCount + 1)
  })

  // Add report count to each NIK record
  const nikRecordsWithCount = (nikRecords || []).map((nikRecord: { nik: string; name: string; isActive: boolean; createdAt: string; updatedAt: string }) => ({
    ...nikRecord,
    _count: {
      reports: reportCountMap.get(nikRecord.nik) || 0,
    },
  }))

  const actualTotal = searchQuery ? (filteredCount || 0) : totalCount
  const hasMore = (page * limit) < actualTotal

  return {
    nikRecords: nikRecordsWithCount,
    total: totalCount || 0,
    totalActive: activeCount || 0,
    hasMore,
  }
}
