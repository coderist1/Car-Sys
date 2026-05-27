import {
  getAllPayments,
  getAllFuelRecords,
  getAuditLogs,
} from "@/lib/db/queries";
import { RecordsPageClient } from "@/components/records/records-page-client";

export default function RecordsPage() {
  return (
    <RecordsPageClient
      payments={getAllPayments()}
      fuelRecords={getAllFuelRecords()}
      auditLogs={getAuditLogs()}
    />
  );
}
