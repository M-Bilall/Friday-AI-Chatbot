import { NextResponse } from 'next/server';

export type ApiResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
};

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data } satisfies ApiResponse<T>, { status: init?.status ?? 200, headers: init?.headers });
}

export function errorResponse(message: string, code = 'BAD_REQUEST', status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details
      }
    } satisfies ApiErrorResponse,
    { status }
  );
}
