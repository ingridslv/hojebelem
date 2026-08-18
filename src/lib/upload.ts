import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function saveProfileImage(file: File) {
  const extension = allowedTypes.get(file.type);
  if (!extension)
    throw new Error("Formato inválido. Envie uma imagem JPG, PNG ou WebP.");
  if (file.size > MAX_IMAGE_SIZE)
    throw new Error("A imagem deve ter no máximo 5 MB.");
  const filename = `avatar-${randomUUID()}.${extension}`;
  const uploadDirectory = path.join(
    process.cwd(),
    process.env.UPLOAD_DIR ?? "public/uploads",
  );
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(
    path.join(uploadDirectory, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/${filename}`;
}
