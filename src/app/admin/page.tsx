import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminContext } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return <AdminDashboard adminName={context.admin.name} />;
}
