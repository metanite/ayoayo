import { redirect } from "next/navigation";
import { AdminShopList } from "@/components/admin-dashboard";
import { getAdminContext } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminShopsPage() {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return <AdminShopList adminName={context.admin.name} />;
}
