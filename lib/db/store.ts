import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { StoredDocument } from "@/lib/types/document";

export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type DatabaseShape = {
  users: StoredUser[];
  documents: StoredDocument[];
};

const DB_PATH = path.join(process.cwd(), "data", "app-db.json");

async function ensureDbFile() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    const initial: DatabaseShape = { users: [], documents: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

function normalizeDocument(document: StoredDocument | (Omit<StoredDocument, "sourceFileName"> & { sourceFileName?: string | null })): StoredDocument {
  return {
    ...document,
    sourceFileName: document.sourceFileName ?? null,
  };
}

async function readDb(): Promise<DatabaseShape> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw) as {
    users?: StoredUser[];
    documents?: Array<StoredDocument | (Omit<StoredDocument, "sourceFileName"> & { sourceFileName?: string | null })>;
  };

  return {
    users: parsed.users ?? [],
    documents: (parsed.documents ?? []).map((document) => normalizeDocument(document)),
  };
}

async function writeDb(data: DatabaseShape) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  return db.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string) {
  const db = await readDb();
  return db.users.find((user) => user.id === id) ?? null;
}

export async function createUser(user: Omit<StoredUser, "id" | "createdAt">) {
  const db = await readDb();
  const createdUser: StoredUser = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...user,
    email: user.email.toLowerCase(),
  };
  db.users.push(createdUser);
  await writeDb(db);
  return createdUser;
}

export async function createDocument(document: Omit<StoredDocument, "id" | "createdAt" | "updatedAt">) {
  const db = await readDb();
  const now = new Date().toISOString();
  const { sourceFileName, ...rest } = document;
  const createdDocument: StoredDocument = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...rest,
    sourceFileName: sourceFileName ?? null,
  };

  db.documents.push(createdDocument);
  await writeDb(db);
  return createdDocument;
}

export async function listDocumentsForUser(userId: string) {
  const db = await readDb();
  return db.documents
    .filter((document) => document.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDocumentForUser(userId: string, documentId: string) {
  const db = await readDb();
  return db.documents.find((document) => document.userId === userId && document.id === documentId) ?? null;
}
