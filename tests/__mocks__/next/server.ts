import { Request, Response } from 'node-fetch';

export class NextRequest extends Request {
  constructor(input: string | Request, init?: RequestInit) {
    super(input, init);
  }
}

export class NextResponse extends Response {
  static json(data: any, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  }
}
