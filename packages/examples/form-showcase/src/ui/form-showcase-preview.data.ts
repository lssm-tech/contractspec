export const allFieldsDefaultValues = {
	recordId: 'frm_2026_001',
	fullName: 'Alex Morgan',
	email: 'alex@example.com',
	username: 'alexm',
	bio: 'Owns the form renderer adoption plan for the customer portal.',
	currentPassword: 'current-secret',
	newPassword: 'new-secret',
	role: 'admin',
	contactPreference: 'email',
	acceptTerms: true,
	marketingOptIn: true,
	reviewer: {
		id: 'usr_alice',
		name: 'Alice Martin',
		email: 'alice@example.com',
	},
	mailingAddress: {
		line1: '42 Spec Avenue',
		line2: 'Suite 4',
		city: 'Paris',
		region: 'Ile-de-France',
		postalCode: '75002',
		countryCode: 'FR',
	},
	phone: {
		countryCode: '+33',
		nationalNumber: '612345678',
		e164: '+33612345678',
	},
	birthDate: new Date('1992-04-15T00:00:00.000Z'),
	reminderTime: '09:30',
	launchWindow: new Date('2026-05-12T10:00:00.000Z'),
	contacts: [
		{ label: 'work', value: 'alex@example.com', preferred: true },
		{ label: 'backup', value: 'ops@example.com', preferred: false },
	],
};

export const progressiveDefaultValues = {
	companyName: 'Northstar Forms',
	workspaceSlug: 'northstar-forms',
	plan: 'team',
	ownerEmail: 'owner@northstar.example',
	needsSecurityReview: true,
	securityNotes: 'Review PII fields before launch.',
	goLiveDate: new Date('2026-06-01T00:00:00.000Z'),
};
