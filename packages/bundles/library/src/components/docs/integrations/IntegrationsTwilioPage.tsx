import Link from '@contractspec/lib.ui-link';

// export const metadata = {
//   title: 'Twilio Integration: ContractSpec Docs',
//   description:
//     'Send SMS notifications and messages with Twilio in ContractSpec.',
// };

export function IntegrationsTwilioPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Twilio</h1>
				<p className="text-muted-foreground">
					Send SMS notifications, alerts, and two-factor authentication codes
					using Twilio's reliable messaging platform.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Setup</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`# .env
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Sending SMS</h2>
				<div className="overflow-x-auto rounded-lg border border-border bg-background/50 p-4 font-mono text-muted-foreground text-sm">
					<pre>{`capabilityId: twilio-send-sms
provider:
  type: twilio
  operation: sendSMS

inputs:
  to:
    type: string
    description: "Phone number in E.164 format"
  body:
    type: string
    description: "Message content (max 1600 chars)"

outputs:
  messageSid:
    type: string
  status:
    type: string`}</pre>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Use cases</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>Order confirmations and shipping updates</li>
					<li>Two-factor authentication codes</li>
					<li>Appointment reminders</li>
					<li>Alert notifications</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Best practices</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>Always use E.164 format for phone numbers (+1234567890)</li>
					<li>Keep messages under 160 characters to avoid splitting</li>
					<li>Implement rate limiting to prevent spam</li>
					<li>Handle delivery failures gracefully</li>
					<li>Respect opt-out requests</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/integrations/s3" className="btn-ghost">
					Previous: S3 Storage
				</Link>
				<Link href="/docs/integrations/slack" className="btn-primary">
					Next: Slack Messaging
				</Link>
			</div>
		</div>
	);
}
