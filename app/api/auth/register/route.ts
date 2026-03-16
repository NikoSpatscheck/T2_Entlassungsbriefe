import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db/store";
import { hashPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";
import { validateRegistrationInput } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };

  const validation = validateRegistrationInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { email, password, firstName, lastName } = validation.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Diese E-Mail-Adresse ist bereits registriert." }, { status: 409 });
  }

  const { hash, salt } = hashPassword(password);
  const user = await createUser({
    firstName,
    lastName,
    email,
    passwordHash: hash,
    passwordSalt: salt,
  });

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
