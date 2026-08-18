import { toggleWishlistAction } from "@/app/actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";

export async function FavoriteButton({
  eventId,
  className = "heart-button",
}: {
  eventId: string;
  className?: string;
}) {
  const session = await auth();
  const saved = session?.user?.id
    ? Boolean(
        await prisma.wishlist.findUnique({
          where: { userId_eventId: { userId: session.user.id, eventId } },
        }),
      )
    : false;
  const action = toggleWishlistAction.bind(null, eventId);
  return (
    <form action={action} className="favorite-form">
      <button
        type="submit"
        className={`${className}${saved ? " favorite-active" : ""}`}
        aria-label={saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={saved}
      >
        <Heart fill={saved ? "currentColor" : "none"} />
      </button>
    </form>
  );
}
