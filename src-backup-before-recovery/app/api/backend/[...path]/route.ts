import { cookies } from "next/headers";

import { serverEnv } from "@/config/server-env";


type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};


async function proxyRequest(
  request: Request,
  context: RouteContext,
) {
  const {
    path,
  } = await context.params;

  if (path[0] !== "admin") {
    return Response.json(
      {
        detail:
          "Only admin API routes are allowed",
      },
      {
        status: 403,
      },
    );
  }

  const cookieStore = await cookies();

  const token = cookieStore.get(
    "portfolio_access_token",
  )?.value;

  if (!token) {
    return Response.json(
      {
        detail: "Not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const incomingUrl = new URL(
    request.url,
  );

  const backendUrl =
    `${serverEnv.apiUrl}/${path.join("/")}` +
    incomingUrl.search;

  const headers = new Headers();

  headers.set(
    "Authorization",
    `Bearer ${token}`,
  );

  const contentType =
    request.headers.get(
      "content-type",
    );

  if (contentType) {
    headers.set(
      "Content-Type",
      contentType,
    );
  }

  const accept =
    request.headers.get("accept");

  if (accept) {
    headers.set(
      "Accept",
      accept,
    );
  }

  let body:
    | ArrayBuffer
    | undefined;

  if (
    request.method !== "GET" &&
    request.method !== "HEAD"
  ) {
    body = await request.arrayBuffer();
  }

  const response = await fetch(
    backendUrl,
    {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    },
  );

  const responseHeaders =
    new Headers();

  const responseContentType =
    response.headers.get(
      "content-type",
    );

  if (responseContentType) {
    responseHeaders.set(
      "Content-Type",
      responseContentType,
    );
  }


  /*
   * HTTP 204, 205 y 304 no pueden
   * contener un response body.
   */
  if (
    response.status === 204 ||
    response.status === 205 ||
    response.status === 304
  ) {
    return new Response(
      null,
      {
        status: response.status,
        headers: responseHeaders,
      },
    );
  }


  const responseBody =
    await response.arrayBuffer();


  return new Response(
    responseBody,
    {
      status: response.status,
      headers: responseHeaders,
    },
  );
}


export function GET(
  request: Request,
  context: RouteContext,
) {
  return proxyRequest(
    request,
    context,
  );
}


export function POST(
  request: Request,
  context: RouteContext,
) {
  return proxyRequest(
    request,
    context,
  );
}


export function PATCH(
  request: Request,
  context: RouteContext,
) {
  return proxyRequest(
    request,
    context,
  );
}


export function PUT(
  request: Request,
  context: RouteContext,
) {
  return proxyRequest(
    request,
    context,
  );
}


export function DELETE(
  request: Request,
  context: RouteContext,
) {
  return proxyRequest(
    request,
    context,
  );
}