import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/db/store";
import { validateLoginInput } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  const validation = validateLoginInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { email, password } = validation.data;
  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return NextResponse.json({ error: "E-Mail oder Passwort sind nicht korrekt." }, { status: 401 });
  }

  await setSession({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  return NextResponse.json({
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
}
