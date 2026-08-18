import { createEventAction } from "@/app/actions";
import { AdminEventForm } from "@/components/admin-event-form";
import { getCategories } from "@/lib/data";

export default async function NewEvent() {
  const categories = await getCategories();
  return (
    <div className="admin-page shell page-space">
      <div className="page-intro">
        <p>NOVO EVENTO</p>
        <h1>Publique um rolê</h1>
        <span>Preencha o essencial. Você poderá editar depois.</span>
      </div>
      <AdminEventForm categories={categories} action={createEventAction} />
    </div>
  );
}
