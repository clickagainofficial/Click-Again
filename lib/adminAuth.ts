import "server-only";
import { cookies } from "next/headers";

import { SESSION_COOKIE, readSession } from "@/lib/session";

/**
 * Checked inside admin route handlers as well as in middleware, so an API
 * route left out of the middleware matcher still can't be called anonymously.
 */
export async function isAdmin() {
  const jar = await cookies();
  return Boolean(await readSession(jar.get(SESSION_COOKIE)?.value));
}
