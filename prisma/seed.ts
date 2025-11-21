import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Create admin user
  console.log('Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aspirasi.gov' },
    update: {},
    create: {
      email: 'admin@aspirasi.gov',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
      emailVerified: false,
    },
  })
  console.log(`✓ Admin user created: ${admin.email}`)

  // 2. Create test NIK records
  console.log('Creating test NIK records...')
  
  const testNIKs = [
    { nik: '1234567890123456', name: 'Pak Udin' },
    { nik: '2345678901234567', name: 'Siti Aminah' },
    { nik: '3456789012345678', name: 'Ahmad Yani' },
    { nik: '4567890123456789', name: 'Fatimah' },
    { nik: '5678901234567890', name: 'Budi Santoso' },
  ]

  for (const nikData of testNIKs) {
    await prisma.nIKRecord.upsert({
      where: { nik: nikData.nik },
      update: {},
      create: {
        nik: nikData.nik,
        name: nikData.name,
        isActive: true,
      },
    })
    console.log(`✓ NIK created: ${nikData.nik} (${nikData.name})`)
  }

  // 3. Create sample reports
  console.log('Creating sample reports...')
  
  const sampleReports = [
    {
      nik: '1234567890123456',
      title: 'Perbaikan Jalan RT 03 yang Rusak Parah',
      category: 'Infrastruktur',
      location: 'DUSUN_KARANG_BARU_TIMUR' as const,
      description: 'Kondisi jalan di area RT 03 sangat memprihatinkan dengan banyak lubang dan kerusakan parah. Hal ini menyulitkan akses kendaraan dan membahayakan pengendara motor.',
    },
    {
      nik: '2345678901234567',
      title: 'Penambahan Kegiatan Posyandu Rutin',
      category: 'Sosial',
      location: 'DUSUN_TAMPATAN' as const,
      description: 'Kami mengusulkan penambahan kegiatan posyandu dan penyuluhan kesehatan secara rutin untuk ibu dan anak. Saat ini kegiatan posyandu hanya dilakukan sebulan sekali.',
    },
    {
      nik: '3456789012345678',
      title: 'Penanganan Sampah Menumpuk di Pemukiman',
      category: 'Lingkungan',
      location: 'DUSUN_PAOK_DANGKA' as const,
      description: 'Sampah menumpuk di area pemukiman warga terutama di dekat jalan utama. Hal ini menimbulkan bau tidak sedap dan menjadi sarang penyakit.',
    },
  ]

  for (const reportData of sampleReports) {
    await prisma.report.create({
      data: {
        nik: reportData.nik,
        title: reportData.title,
        category: reportData.category,
        location: reportData.location,
        description: reportData.description,
        status: 'DRAFT',
      },
    })
    console.log(`✓ Report created: "${reportData.title}" (${reportData.category})`)
  }

  console.log('\n✨ Database seeding completed successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('   Email: admin@aspirasi.gov')
  console.log('   Password: admin123')
  console.log('\n🔑 Test NIKs:')
  testNIKs.forEach(nik => {
    console.log(`   ${nik.nik} - ${nik.name}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
