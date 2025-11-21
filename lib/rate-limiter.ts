import { db } from "@/lib/db";

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_HOURS = 5;

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
  message?: string;
}

export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const realIP = headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return "unknown";
}

export async function checkRateLimit(ipAddress: string): Promise<RateLimitResult> {
  try {
    const now = new Date();
    
    const { data: rateLimitRecord, error } = await db
      .from('RateLimitRecord')
      .select('*')
      .eq('ip', ipAddress)
      .single();

    if (error || !rateLimitRecord) {
      return {
        allowed: true,
        remainingAttempts: MAX_ATTEMPTS,
      };
    }

    if (rateLimitRecord.blockedUntil && new Date(rateLimitRecord.blockedUntil) > now) {
      const hoursLeft = Math.ceil(
        (new Date(rateLimitRecord.blockedUntil).getTime() - now.getTime()) / (1000 * 60 * 60)
      );
      return {
        allowed: false,
        blockedUntil: new Date(rateLimitRecord.blockedUntil),
        message: `Terlalu banyak percobaan gagal. Coba lagi dalam ${hoursLeft} jam.`,
      };
    }

    if (rateLimitRecord.blockedUntil && new Date(rateLimitRecord.blockedUntil) <= now) {
      await db
        .from('RateLimitRecord')
        .update({
          attempts: 0,
          blockedUntil: null,
          lastAttempt: now.toISOString(),
        })
        .eq('ip', ipAddress);
      
      return {
        allowed: true,
        remainingAttempts: MAX_ATTEMPTS,
      };
    }

    if (rateLimitRecord.attempts >= MAX_ATTEMPTS) {
      const blockUntil = new Date(now.getTime() + BLOCK_DURATION_HOURS * 60 * 60 * 1000);
      
      await db
        .from('RateLimitRecord')
        .update({ 
          blockedUntil: blockUntil.toISOString(),
          lastAttempt: now.toISOString()
        })
        .eq('ip', ipAddress);

      return {
        allowed: false,
        blockedUntil: blockUntil,
        message: `Terlalu banyak percobaan gagal. Coba lagi dalam ${BLOCK_DURATION_HOURS} jam.`,
      };
    }

    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - rateLimitRecord.attempts,
    };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }
}

export async function recordFailedAttempt(ipAddress: string): Promise<void> {
  try {
    const now = new Date();
    
    const { data: existingRecord } = await db
      .from('RateLimitRecord')
      .select('*')
      .eq('ip', ipAddress)
      .single();

    if (existingRecord) {
      await db
        .from('RateLimitRecord')
        .update({
          attempts: existingRecord.attempts + 1,
          lastAttempt: now.toISOString(),
        })
        .eq('ip', ipAddress);
    } else {
      await db
        .from('RateLimitRecord')
        .insert({
          ip: ipAddress,
          attempts: 1,
          lastAttempt: now.toISOString(),
        });
    }
  } catch (error) {
    console.error("Error recording failed attempt:", error);
  }
}

export async function resetRateLimit(ipAddress: string): Promise<void> {
  try {
    await db
      .from('RateLimitRecord')
      .update({
        attempts: 0,
        blockedUntil: null,
        lastAttempt: new Date().toISOString(),
      })
      .eq('ip', ipAddress);
  } catch {

  }
}

export async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    const now = new Date();
    const { data, error } = await db
      .from('RateLimitRecord')
      .delete()
      .lt('blockedUntil', now.toISOString())
      .eq('attempts', 0)
      .select();
    
    if (error) {
      console.error("Error cleaning up rate limits:", error);
      return 0;
    }
    
    return data?.length || 0;
  } catch (error) {
    console.error("Error cleaning up rate limits:", error);
    return 0;
  }
}
