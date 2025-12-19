import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const totalReports = await prisma.report.count();

    const logMessage = {
      timestamp: new Date().toISOString(),
      event: "CRON_KEEP_ALIVE",
      totalReports,
      status: "SUCCESS",
    };

    console.log(JSON.stringify(logMessage));

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        data: {
          totalReports,
          message: "Database keep-alive check completed successfully",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        event: "CRON_KEEP_ALIVE",
        status: "ERROR",
        error: errorMessage,
      })
    );

    return new Response(
      JSON.stringify({
        success: false,
        timestamp: new Date().toISOString(),
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const revalidate = 0;
