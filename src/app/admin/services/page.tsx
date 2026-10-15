import { redirect } from "next/navigation";
import { AdminServicesPage } from "@/components/admin-services";
import { getAdminContext } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminServicesRoute() {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return <AdminServicesPage adminName={context.admin.name} />;
}
