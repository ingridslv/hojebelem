import { updateProfileAction } from "@/app/actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditProfile() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/perfil/editar");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  return (
    <div className="profile-page shell page-space">
      <div className="page-intro">
        <p>SEU PERFIL</p>
        <h1>Editar perfil</h1>
        <span>Atualize como seu nome e sua foto aparecem na plataforma.</span>
      </div>
      <form
        className="event-form profile-edit-form"
        action={updateProfileAction}
      >
        <section>
          <label>
            Nome
            <input
              name="name"
              defaultValue={user.name ?? ""}
              minLength={2}
              maxLength={80}
              required
            />
          </label>
          <label>
            Enviar nova foto
            <input
              type="file"
              name="avatarFile"
              accept="image/jpeg,image/png,image/webp"
            />
          </label>
          <div className="divider">
            <span>ou use uma URL</span>
          </div>
          <label>
            URL da foto
            <input
              type="url"
              name="avatarUrl"
              defaultValue={user.avatarUrl ?? ""}
              placeholder="https://exemplo.com/minha-foto.jpg"
            />
          </label>
          <small>
            Envie JPG, PNG ou WebP de até 5 MB. O anexo tem prioridade sobre a
            URL.
          </small>
        </section>
        <button className="gradient-button" type="submit">
          Salvar perfil
        </button>
      </form>
    </div>
  );
}
