export function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Unknown',
      isDesktop: true,
      isMobile: false,
      isTablet: false,
    }
  }

  const ua = userAgent.toLowerCase()
  
  // Browser detection
  let browser = 'Unknown'
  if (ua.includes('edg/')) browser = 'Edge'
  else if (ua.includes('chrome/')) browser = 'Chrome'
  else if (ua.includes('safari/') && !ua.includes('chrome')) browser = 'Safari'
  else if (ua.includes('firefox/')) browser = 'Firefox'
  else if (ua.includes('opera/') || ua.includes('opr/')) browser = 'Opera'
  
  // OS detection
  let os = 'Unknown'
  if (ua.includes('windows nt 10.0')) os = 'Windows 10/11'
  else if (ua.includes('windows nt 6.3')) os = 'Windows 8.1'
  else if (ua.includes('windows nt 6.2')) os = 'Windows 8'
  else if (ua.includes('windows nt 6.1')) os = 'Windows 7'
  else if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac os x')) {
    const match = ua.match(/mac os x (\d+)[._](\d+)/)
    if (match) {
      os = `macOS ${match[1]}.${match[2]}`
    } else {
      os = 'macOS'
    }
  }
  else if (ua.includes('linux')) os = 'Linux'
  else if (ua.includes('android')) {
    const match = ua.match(/android (\d+)/)
    os = match ? `Android ${match[1]}` : 'Android'
  }
  else if (ua.includes('iphone')) os = 'iOS (iPhone)'
  else if (ua.includes('ipad')) os = 'iOS (iPad)'
  
  // Device type detection
  const isMobile = ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')
  const isTablet = ua.includes('tablet') || ua.includes('ipad')
  const isDesktop = !isMobile && !isTablet
  
  let device = 'Desktop'
  if (isMobile) device = 'Mobile'
  if (isTablet) device = 'Tablet'
  
  return {
    browser,
    os,
    device,
    isDesktop,
    isMobile,
    isTablet,
  }
}

export function getDeviceDescription(userAgent: string | null): string {
  const { browser, os, device } = parseUserAgent(userAgent)
  return `${browser} on ${os} (${device})`
}
