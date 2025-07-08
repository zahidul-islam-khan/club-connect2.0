import { NextResponse } from 'next/server';

/**
 * Test API handler that returns a simple JSON response
 * No authentication needed - used to test API routing
 */
export async function GET() {
  return NextResponse.json({ success: true, message: 'Test API is working!' });
}
