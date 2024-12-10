import { NextResponse } from 'next/server';
import { loadComponents } from '@/lib/load-components';

/**
 * API Route: GET /api/components
 * 
 * Retrieves all component metadata from the component library.
 * Used by the client-side component browser for dynamic loading and filtering.
 * 
 * @returns {Promise<NextResponse>} JSON response containing:
 * - On success: { components: ComponentMeta[], warnings?: string[] }
 * - On error: { error: string } with appropriate status code
 */
export async function GET() {
  const result = await loadComponents();
  
  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 404 }
    );
  }

  return NextResponse.json({
    components: result.components,
    warnings: result.warnings
  });
}
