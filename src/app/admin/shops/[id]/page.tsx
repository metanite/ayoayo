import { redirect } from "next/navigation";
import { AdminShopForm } from "@/components/admin-dashboard";
import { getAdminContext } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function EditShopPage({ params }: { params: { id: string } }) {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return <AdminShopForm adminName={context.admin.name} shopId={params.id} />;
}
