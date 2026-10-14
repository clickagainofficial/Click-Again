import SmtpSettingsForm from "@/components/admin/SmtpSettingsForm";
import { getPublicSmtpSettings, type PublicSmtpSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let initial: PublicSmtpSettings | null = null;
  let error = "";
  try {
    initial = await getPublicSmtpSettings();
  } catch (err) {
    error = `Could not read settings: ${String(err)}`;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          The mailbox enquiries are sent from. When someone fills in the contact
          form, they get a thank-you mail and you get an alert.
        </p>
      </div>

      {initial ? (
        <SmtpSettingsForm initial={initial} />
      ) : (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}
