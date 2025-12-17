/* eslint-disable */
import type { Prisma, EvolutionSession, StudioIntegration, IntegrationConnection, KnowledgeSource, Learner, OnboardingTrack, OnboardingStep, OnboardingProgress, OnboardingStepCompletion, OrganizationLifecycleProfile, LifecycleAssessment, LifecycleMilestoneProgress, User, Session, Account, Verification, Organization, Member, Invitation, Team, TeamMember, Role, Permission, PolicyBinding, ApiKey, Passkey, SsoProvider, OAuthApplication, OAuthAccessToken, OAuthConsent, Referral, ReferralReward, StudioProject, StudioProjectTeam, StudioProjectSlugAlias, StudioLearningEvent, StudioSpec, StudioOverlay, StudioDeployment, TaskCategory, Task, Conversation, ConversationParticipant, Message, RecipeCategory, Recipe, RecipeIngredient, RecipeInstruction } from "./prisma/client.js";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    EvolutionSession: {
        Name: "EvolutionSession";
        Shape: EvolutionSession;
        Include: Prisma.EvolutionSessionInclude;
        Select: Prisma.EvolutionSessionSelect;
        OrderBy: Prisma.EvolutionSessionOrderByWithRelationInput;
        WhereUnique: Prisma.EvolutionSessionWhereUniqueInput;
        Where: Prisma.EvolutionSessionWhereInput;
        Create: {};
        Update: {};
        RelationName: "project";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
        };
    };
    StudioIntegration: {
        Name: "StudioIntegration";
        Shape: StudioIntegration;
        Include: Prisma.StudioIntegrationInclude;
        Select: Prisma.StudioIntegrationSelect;
        OrderBy: Prisma.StudioIntegrationOrderByWithRelationInput;
        WhereUnique: Prisma.StudioIntegrationWhereUniqueInput;
        Where: Prisma.StudioIntegrationWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "project";
        ListRelations: never;
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            project: {
                Shape: StudioProject | null;
                Name: "StudioProject";
                Nullable: true;
            };
        };
    };
    IntegrationConnection: {
        Name: "IntegrationConnection";
        Shape: IntegrationConnection;
        Include: Prisma.IntegrationConnectionInclude;
        Select: Prisma.IntegrationConnectionSelect;
        OrderBy: Prisma.IntegrationConnectionOrderByWithRelationInput;
        WhereUnique: Prisma.IntegrationConnectionWhereUniqueInput;
        Where: Prisma.IntegrationConnectionWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization";
        ListRelations: never;
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
        };
    };
    KnowledgeSource: {
        Name: "KnowledgeSource";
        Shape: KnowledgeSource;
        Include: Prisma.KnowledgeSourceInclude;
        Select: Prisma.KnowledgeSourceSelect;
        OrderBy: Prisma.KnowledgeSourceOrderByWithRelationInput;
        WhereUnique: Prisma.KnowledgeSourceWhereUniqueInput;
        Where: Prisma.KnowledgeSourceWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "project";
        ListRelations: never;
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            project: {
                Shape: StudioProject | null;
                Name: "StudioProject";
                Nullable: true;
            };
        };
    };
    Learner: {
        Name: "Learner";
        Shape: Learner;
        Include: Prisma.LearnerInclude;
        Select: Prisma.LearnerSelect;
        OrderBy: Prisma.LearnerOrderByWithRelationInput;
        WhereUnique: Prisma.LearnerWhereUniqueInput;
        Where: Prisma.LearnerWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "organization" | "onboardingProgress";
        ListRelations: "onboardingProgress";
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            onboardingProgress: {
                Shape: OnboardingProgress[];
                Name: "OnboardingProgress";
                Nullable: false;
            };
        };
    };
    OnboardingTrack: {
        Name: "OnboardingTrack";
        Shape: OnboardingTrack;
        Include: Prisma.OnboardingTrackInclude;
        Select: Prisma.OnboardingTrackSelect;
        OrderBy: Prisma.OnboardingTrackOrderByWithRelationInput;
        WhereUnique: Prisma.OnboardingTrackWhereUniqueInput;
        Where: Prisma.OnboardingTrackWhereInput;
        Create: {};
        Update: {};
        RelationName: "steps" | "progress";
        ListRelations: "steps" | "progress";
        Relations: {
            steps: {
                Shape: OnboardingStep[];
                Name: "OnboardingStep";
                Nullable: false;
            };
            progress: {
                Shape: OnboardingProgress[];
                Name: "OnboardingProgress";
                Nullable: false;
            };
        };
    };
    OnboardingStep: {
        Name: "OnboardingStep";
        Shape: OnboardingStep;
        Include: Prisma.OnboardingStepInclude;
        Select: Prisma.OnboardingStepSelect;
        OrderBy: Prisma.OnboardingStepOrderByWithRelationInput;
        WhereUnique: Prisma.OnboardingStepWhereUniqueInput;
        Where: Prisma.OnboardingStepWhereInput;
        Create: {};
        Update: {};
        RelationName: "track" | "stepCompletions";
        ListRelations: "stepCompletions";
        Relations: {
            track: {
                Shape: OnboardingTrack;
                Name: "OnboardingTrack";
                Nullable: false;
            };
            stepCompletions: {
                Shape: OnboardingStepCompletion[];
                Name: "OnboardingStepCompletion";
                Nullable: false;
            };
        };
    };
    OnboardingProgress: {
        Name: "OnboardingProgress";
        Shape: OnboardingProgress;
        Include: Prisma.OnboardingProgressInclude;
        Select: Prisma.OnboardingProgressSelect;
        OrderBy: Prisma.OnboardingProgressOrderByWithRelationInput;
        WhereUnique: Prisma.OnboardingProgressWhereUniqueInput;
        Where: Prisma.OnboardingProgressWhereInput;
        Create: {};
        Update: {};
        RelationName: "learner" | "track" | "stepCompletions";
        ListRelations: "stepCompletions";
        Relations: {
            learner: {
                Shape: Learner;
                Name: "Learner";
                Nullable: false;
            };
            track: {
                Shape: OnboardingTrack;
                Name: "OnboardingTrack";
                Nullable: false;
            };
            stepCompletions: {
                Shape: OnboardingStepCompletion[];
                Name: "OnboardingStepCompletion";
                Nullable: false;
            };
        };
    };
    OnboardingStepCompletion: {
        Name: "OnboardingStepCompletion";
        Shape: OnboardingStepCompletion;
        Include: Prisma.OnboardingStepCompletionInclude;
        Select: Prisma.OnboardingStepCompletionSelect;
        OrderBy: Prisma.OnboardingStepCompletionOrderByWithRelationInput;
        WhereUnique: Prisma.OnboardingStepCompletionWhereUniqueInput;
        Where: Prisma.OnboardingStepCompletionWhereInput;
        Create: {};
        Update: {};
        RelationName: "progress" | "step";
        ListRelations: never;
        Relations: {
            progress: {
                Shape: OnboardingProgress;
                Name: "OnboardingProgress";
                Nullable: false;
            };
            step: {
                Shape: OnboardingStep;
                Name: "OnboardingStep";
                Nullable: false;
            };
        };
    };
    OrganizationLifecycleProfile: {
        Name: "OrganizationLifecycleProfile";
        Shape: OrganizationLifecycleProfile;
        Include: Prisma.OrganizationLifecycleProfileInclude;
        Select: Prisma.OrganizationLifecycleProfileSelect;
        OrderBy: Prisma.OrganizationLifecycleProfileOrderByWithRelationInput;
        WhereUnique: Prisma.OrganizationLifecycleProfileWhereUniqueInput;
        Where: Prisma.OrganizationLifecycleProfileWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "assessments" | "milestones";
        ListRelations: "assessments" | "milestones";
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            assessments: {
                Shape: LifecycleAssessment[];
                Name: "LifecycleAssessment";
                Nullable: false;
            };
            milestones: {
                Shape: LifecycleMilestoneProgress[];
                Name: "LifecycleMilestoneProgress";
                Nullable: false;
            };
        };
    };
    LifecycleAssessment: {
        Name: "LifecycleAssessment";
        Shape: LifecycleAssessment;
        Include: Prisma.LifecycleAssessmentInclude;
        Select: Prisma.LifecycleAssessmentSelect;
        OrderBy: Prisma.LifecycleAssessmentOrderByWithRelationInput;
        WhereUnique: Prisma.LifecycleAssessmentWhereUniqueInput;
        Where: Prisma.LifecycleAssessmentWhereInput;
        Create: {};
        Update: {};
        RelationName: "profile";
        ListRelations: never;
        Relations: {
            profile: {
                Shape: OrganizationLifecycleProfile;
                Name: "OrganizationLifecycleProfile";
                Nullable: false;
            };
        };
    };
    LifecycleMilestoneProgress: {
        Name: "LifecycleMilestoneProgress";
        Shape: LifecycleMilestoneProgress;
        Include: Prisma.LifecycleMilestoneProgressInclude;
        Select: Prisma.LifecycleMilestoneProgressSelect;
        OrderBy: Prisma.LifecycleMilestoneProgressOrderByWithRelationInput;
        WhereUnique: Prisma.LifecycleMilestoneProgressWhereUniqueInput;
        Where: Prisma.LifecycleMilestoneProgressWhereInput;
        Create: {};
        Update: {};
        RelationName: "profile";
        ListRelations: never;
        Relations: {
            profile: {
                Shape: OrganizationLifecycleProfile;
                Name: "OrganizationLifecycleProfile";
                Nullable: false;
            };
        };
    };
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "sessions" | "accounts" | "memberships" | "invitations" | "teamMemberships" | "policyBindings" | "apiKeys" | "passkeys" | "ssoProviders" | "learners";
        ListRelations: "sessions" | "accounts" | "memberships" | "invitations" | "teamMemberships" | "policyBindings" | "apiKeys" | "passkeys" | "ssoProviders" | "learners";
        Relations: {
            sessions: {
                Shape: Session[];
                Name: "Session";
                Nullable: false;
            };
            accounts: {
                Shape: Account[];
                Name: "Account";
                Nullable: false;
            };
            memberships: {
                Shape: Member[];
                Name: "Member";
                Nullable: false;
            };
            invitations: {
                Shape: Invitation[];
                Name: "Invitation";
                Nullable: false;
            };
            teamMemberships: {
                Shape: TeamMember[];
                Name: "TeamMember";
                Nullable: false;
            };
            policyBindings: {
                Shape: PolicyBinding[];
                Name: "PolicyBinding";
                Nullable: false;
            };
            apiKeys: {
                Shape: ApiKey[];
                Name: "ApiKey";
                Nullable: false;
            };
            passkeys: {
                Shape: Passkey[];
                Name: "Passkey";
                Nullable: false;
            };
            ssoProviders: {
                Shape: SsoProvider[];
                Name: "SsoProvider";
                Nullable: false;
            };
            learners: {
                Shape: Learner[];
                Name: "Learner";
                Nullable: false;
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Select: Prisma.SessionSelect;
        OrderBy: Prisma.SessionOrderByWithRelationInput;
        WhereUnique: Prisma.SessionWhereUniqueInput;
        Where: Prisma.SessionWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    Account: {
        Name: "Account";
        Shape: Account;
        Include: Prisma.AccountInclude;
        Select: Prisma.AccountSelect;
        OrderBy: Prisma.AccountOrderByWithRelationInput;
        WhereUnique: Prisma.AccountWhereUniqueInput;
        Where: Prisma.AccountWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    Verification: {
        Name: "Verification";
        Shape: Verification;
        Include: never;
        Select: Prisma.VerificationSelect;
        OrderBy: Prisma.VerificationOrderByWithRelationInput;
        WhereUnique: Prisma.VerificationWhereUniqueInput;
        Where: Prisma.VerificationWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Organization: {
        Name: "Organization";
        Shape: Organization;
        Include: Prisma.OrganizationInclude;
        Select: Prisma.OrganizationSelect;
        OrderBy: Prisma.OrganizationOrderByWithRelationInput;
        WhereUnique: Prisma.OrganizationWhereUniqueInput;
        Where: Prisma.OrganizationWhereInput;
        Create: {};
        Update: {};
        RelationName: "members" | "invitations" | "teams" | "policyBindings" | "ssoProviders" | "lifecycleProfile" | "studioProjects" | "studioIntegrations" | "integrationConnections" | "knowledgeSources" | "learners" | "referrals" | "referralReceived" | "referralRewards";
        ListRelations: "members" | "invitations" | "teams" | "policyBindings" | "ssoProviders" | "studioProjects" | "studioIntegrations" | "integrationConnections" | "knowledgeSources" | "learners" | "referrals" | "referralRewards";
        Relations: {
            members: {
                Shape: Member[];
                Name: "Member";
                Nullable: false;
            };
            invitations: {
                Shape: Invitation[];
                Name: "Invitation";
                Nullable: false;
            };
            teams: {
                Shape: Team[];
                Name: "Team";
                Nullable: false;
            };
            policyBindings: {
                Shape: PolicyBinding[];
                Name: "PolicyBinding";
                Nullable: false;
            };
            ssoProviders: {
                Shape: SsoProvider[];
                Name: "SsoProvider";
                Nullable: false;
            };
            lifecycleProfile: {
                Shape: OrganizationLifecycleProfile | null;
                Name: "OrganizationLifecycleProfile";
                Nullable: true;
            };
            studioProjects: {
                Shape: StudioProject[];
                Name: "StudioProject";
                Nullable: false;
            };
            studioIntegrations: {
                Shape: StudioIntegration[];
                Name: "StudioIntegration";
                Nullable: false;
            };
            integrationConnections: {
                Shape: IntegrationConnection[];
                Name: "IntegrationConnection";
                Nullable: false;
            };
            knowledgeSources: {
                Shape: KnowledgeSource[];
                Name: "KnowledgeSource";
                Nullable: false;
            };
            learners: {
                Shape: Learner[];
                Name: "Learner";
                Nullable: false;
            };
            referrals: {
                Shape: Referral[];
                Name: "Referral";
                Nullable: false;
            };
            referralReceived: {
                Shape: Referral | null;
                Name: "Referral";
                Nullable: true;
            };
            referralRewards: {
                Shape: ReferralReward[];
                Name: "ReferralReward";
                Nullable: false;
            };
        };
    };
    Member: {
        Name: "Member";
        Shape: Member;
        Include: Prisma.MemberInclude;
        Select: Prisma.MemberSelect;
        OrderBy: Prisma.MemberOrderByWithRelationInput;
        WhereUnique: Prisma.MemberWhereUniqueInput;
        Where: Prisma.MemberWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "organization";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
        };
    };
    Invitation: {
        Name: "Invitation";
        Shape: Invitation;
        Include: Prisma.InvitationInclude;
        Select: Prisma.InvitationSelect;
        OrderBy: Prisma.InvitationOrderByWithRelationInput;
        WhereUnique: Prisma.InvitationWhereUniqueInput;
        Where: Prisma.InvitationWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "inviter" | "team";
        ListRelations: never;
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            inviter: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            team: {
                Shape: Team | null;
                Name: "Team";
                Nullable: true;
            };
        };
    };
    Team: {
        Name: "Team";
        Shape: Team;
        Include: Prisma.TeamInclude;
        Select: Prisma.TeamSelect;
        OrderBy: Prisma.TeamOrderByWithRelationInput;
        WhereUnique: Prisma.TeamWhereUniqueInput;
        Where: Prisma.TeamWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "members" | "invitations" | "studioProjectTeams";
        ListRelations: "members" | "invitations" | "studioProjectTeams";
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            members: {
                Shape: TeamMember[];
                Name: "TeamMember";
                Nullable: false;
            };
            invitations: {
                Shape: Invitation[];
                Name: "Invitation";
                Nullable: false;
            };
            studioProjectTeams: {
                Shape: StudioProjectTeam[];
                Name: "StudioProjectTeam";
                Nullable: false;
            };
        };
    };
    TeamMember: {
        Name: "TeamMember";
        Shape: TeamMember;
        Include: Prisma.TeamMemberInclude;
        Select: Prisma.TeamMemberSelect;
        OrderBy: Prisma.TeamMemberOrderByWithRelationInput;
        WhereUnique: Prisma.TeamMemberWhereUniqueInput;
        Where: Prisma.TeamMemberWhereInput;
        Create: {};
        Update: {};
        RelationName: "team" | "user";
        ListRelations: never;
        Relations: {
            team: {
                Shape: Team;
                Name: "Team";
                Nullable: false;
            };
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    Role: {
        Name: "Role";
        Shape: Role;
        Include: Prisma.RoleInclude;
        Select: Prisma.RoleSelect;
        OrderBy: Prisma.RoleOrderByWithRelationInput;
        WhereUnique: Prisma.RoleWhereUniqueInput;
        Where: Prisma.RoleWhereInput;
        Create: {};
        Update: {};
        RelationName: "PolicyBinding";
        ListRelations: "PolicyBinding";
        Relations: {
            PolicyBinding: {
                Shape: PolicyBinding[];
                Name: "PolicyBinding";
                Nullable: false;
            };
        };
    };
    Permission: {
        Name: "Permission";
        Shape: Permission;
        Include: never;
        Select: Prisma.PermissionSelect;
        OrderBy: Prisma.PermissionOrderByWithRelationInput;
        WhereUnique: Prisma.PermissionWhereUniqueInput;
        Where: Prisma.PermissionWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    PolicyBinding: {
        Name: "PolicyBinding";
        Shape: PolicyBinding;
        Include: Prisma.PolicyBindingInclude;
        Select: Prisma.PolicyBindingSelect;
        OrderBy: Prisma.PolicyBindingOrderByWithRelationInput;
        WhereUnique: Prisma.PolicyBindingWhereUniqueInput;
        Where: Prisma.PolicyBindingWhereInput;
        Create: {};
        Update: {};
        RelationName: "role" | "User" | "Organization";
        ListRelations: never;
        Relations: {
            role: {
                Shape: Role;
                Name: "Role";
                Nullable: false;
            };
            User: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            Organization: {
                Shape: Organization | null;
                Name: "Organization";
                Nullable: true;
            };
        };
    };
    ApiKey: {
        Name: "ApiKey";
        Shape: ApiKey;
        Include: Prisma.ApiKeyInclude;
        Select: Prisma.ApiKeySelect;
        OrderBy: Prisma.ApiKeyOrderByWithRelationInput;
        WhereUnique: Prisma.ApiKeyWhereUniqueInput;
        Where: Prisma.ApiKeyWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    Passkey: {
        Name: "Passkey";
        Shape: Passkey;
        Include: Prisma.PasskeyInclude;
        Select: Prisma.PasskeySelect;
        OrderBy: Prisma.PasskeyOrderByWithRelationInput;
        WhereUnique: Prisma.PasskeyWhereUniqueInput;
        Where: Prisma.PasskeyWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    SsoProvider: {
        Name: "SsoProvider";
        Shape: SsoProvider;
        Include: Prisma.SsoProviderInclude;
        Select: Prisma.SsoProviderSelect;
        OrderBy: Prisma.SsoProviderOrderByWithRelationInput;
        WhereUnique: Prisma.SsoProviderWhereUniqueInput;
        Where: Prisma.SsoProviderWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "user";
        ListRelations: never;
        Relations: {
            organization: {
                Shape: Organization | null;
                Name: "Organization";
                Nullable: true;
            };
            user: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
        };
    };
    OAuthApplication: {
        Name: "OAuthApplication";
        Shape: OAuthApplication;
        Include: never;
        Select: Prisma.OAuthApplicationSelect;
        OrderBy: Prisma.OAuthApplicationOrderByWithRelationInput;
        WhereUnique: Prisma.OAuthApplicationWhereUniqueInput;
        Where: Prisma.OAuthApplicationWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    OAuthAccessToken: {
        Name: "OAuthAccessToken";
        Shape: OAuthAccessToken;
        Include: never;
        Select: Prisma.OAuthAccessTokenSelect;
        OrderBy: Prisma.OAuthAccessTokenOrderByWithRelationInput;
        WhereUnique: Prisma.OAuthAccessTokenWhereUniqueInput;
        Where: Prisma.OAuthAccessTokenWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    OAuthConsent: {
        Name: "OAuthConsent";
        Shape: OAuthConsent;
        Include: never;
        Select: Prisma.OAuthConsentSelect;
        OrderBy: Prisma.OAuthConsentOrderByWithRelationInput;
        WhereUnique: Prisma.OAuthConsentWhereUniqueInput;
        Where: Prisma.OAuthConsentWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Referral: {
        Name: "Referral";
        Shape: Referral;
        Include: Prisma.ReferralInclude;
        Select: Prisma.ReferralSelect;
        OrderBy: Prisma.ReferralOrderByWithRelationInput;
        WhereUnique: Prisma.ReferralWhereUniqueInput;
        Where: Prisma.ReferralWhereInput;
        Create: {};
        Update: {};
        RelationName: "referrerOrganization" | "referredOrganization" | "rewards";
        ListRelations: "rewards";
        Relations: {
            referrerOrganization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            referredOrganization: {
                Shape: Organization | null;
                Name: "Organization";
                Nullable: true;
            };
            rewards: {
                Shape: ReferralReward[];
                Name: "ReferralReward";
                Nullable: false;
            };
        };
    };
    ReferralReward: {
        Name: "ReferralReward";
        Shape: ReferralReward;
        Include: Prisma.ReferralRewardInclude;
        Select: Prisma.ReferralRewardSelect;
        OrderBy: Prisma.ReferralRewardOrderByWithRelationInput;
        WhereUnique: Prisma.ReferralRewardWhereUniqueInput;
        Where: Prisma.ReferralRewardWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "referral";
        ListRelations: never;
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            referral: {
                Shape: Referral;
                Name: "Referral";
                Nullable: false;
            };
        };
    };
    StudioProject: {
        Name: "StudioProject";
        Shape: StudioProject;
        Include: Prisma.StudioProjectInclude;
        Select: Prisma.StudioProjectSelect;
        OrderBy: Prisma.StudioProjectOrderByWithRelationInput;
        WhereUnique: Prisma.StudioProjectWhereUniqueInput;
        Where: Prisma.StudioProjectWhereInput;
        Create: {};
        Update: {};
        RelationName: "organization" | "specs" | "overlays" | "deployments" | "integrations" | "knowledgeSources" | "evolutionSessions" | "taskCategories" | "tasks" | "conversations" | "conversationParticipants" | "messages" | "recipes" | "slugAliases" | "learningEvents" | "teams";
        ListRelations: "specs" | "overlays" | "deployments" | "integrations" | "knowledgeSources" | "evolutionSessions" | "taskCategories" | "tasks" | "conversations" | "conversationParticipants" | "messages" | "recipes" | "slugAliases" | "learningEvents" | "teams";
        Relations: {
            organization: {
                Shape: Organization;
                Name: "Organization";
                Nullable: false;
            };
            specs: {
                Shape: StudioSpec[];
                Name: "StudioSpec";
                Nullable: false;
            };
            overlays: {
                Shape: StudioOverlay[];
                Name: "StudioOverlay";
                Nullable: false;
            };
            deployments: {
                Shape: StudioDeployment[];
                Name: "StudioDeployment";
                Nullable: false;
            };
            integrations: {
                Shape: StudioIntegration[];
                Name: "StudioIntegration";
                Nullable: false;
            };
            knowledgeSources: {
                Shape: KnowledgeSource[];
                Name: "KnowledgeSource";
                Nullable: false;
            };
            evolutionSessions: {
                Shape: EvolutionSession[];
                Name: "EvolutionSession";
                Nullable: false;
            };
            taskCategories: {
                Shape: TaskCategory[];
                Name: "TaskCategory";
                Nullable: false;
            };
            tasks: {
                Shape: Task[];
                Name: "Task";
                Nullable: false;
            };
            conversations: {
                Shape: Conversation[];
                Name: "Conversation";
                Nullable: false;
            };
            conversationParticipants: {
                Shape: ConversationParticipant[];
                Name: "ConversationParticipant";
                Nullable: false;
            };
            messages: {
                Shape: Message[];
                Name: "Message";
                Nullable: false;
            };
            recipes: {
                Shape: Recipe[];
                Name: "Recipe";
                Nullable: false;
            };
            slugAliases: {
                Shape: StudioProjectSlugAlias[];
                Name: "StudioProjectSlugAlias";
                Nullable: false;
            };
            learningEvents: {
                Shape: StudioLearningEvent[];
                Name: "StudioLearningEvent";
                Nullable: false;
            };
            teams: {
                Shape: StudioProjectTeam[];
                Name: "StudioProjectTeam";
                Nullable: false;
            };
        };
    };
    StudioProjectTeam: {
        Name: "StudioProjectTeam";
        Shape: StudioProjectTeam;
        Include: Prisma.StudioProjectTeamInclude;
        Select: Prisma.StudioProjectTeamSelect;
        OrderBy: Prisma.StudioProjectTeamOrderByWithRelationInput;
        WhereUnique: Prisma.StudioProjectTeamWhereUniqueInput;
        Where: Prisma.StudioProjectTeamWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "team";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
            team: {
                Shape: Team;
                Name: "Team";
                Nullable: false;
            };
        };
    };
    StudioProjectSlugAlias: {
        Name: "StudioProjectSlugAlias";
        Shape: StudioProjectSlugAlias;
        Include: Prisma.StudioProjectSlugAliasInclude;
        Select: Prisma.StudioProjectSlugAliasSelect;
        OrderBy: Prisma.StudioProjectSlugAliasOrderByWithRelationInput;
        WhereUnique: Prisma.StudioProjectSlugAliasWhereUniqueInput;
        Where: Prisma.StudioProjectSlugAliasWhereInput;
        Create: {};
        Update: {};
        RelationName: "project";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
        };
    };
    StudioLearningEvent: {
        Name: "StudioLearningEvent";
        Shape: StudioLearningEvent;
        Include: Prisma.StudioLearningEventInclude;
        Select: Prisma.StudioLearningEventSelect;
        OrderBy: Prisma.StudioLearningEventOrderByWithRelationInput;
        WhereUnique: Prisma.StudioLearningEventWhereUniqueInput;
        Where: Prisma.StudioLearningEventWhereInput;
        Create: {};
        Update: {};
        RelationName: "project";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject | null;
                Name: "StudioProject";
                Nullable: true;
            };
        };
    };
    StudioSpec: {
        Name: "StudioSpec";
        Shape: StudioSpec;
        Include: Prisma.StudioSpecInclude;
        Select: Prisma.StudioSpecSelect;
        OrderBy: Prisma.StudioSpecOrderByWithRelationInput;
        WhereUnique: Prisma.StudioSpecWhereUniqueInput;
        Where: Prisma.StudioSpecWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "overlays";
        ListRelations: "overlays";
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
            overlays: {
                Shape: StudioOverlay[];
                Name: "StudioOverlay";
                Nullable: false;
            };
        };
    };
    StudioOverlay: {
        Name: "StudioOverlay";
        Shape: StudioOverlay;
        Include: Prisma.StudioOverlayInclude;
        Select: Prisma.StudioOverlaySelect;
        OrderBy: Prisma.StudioOverlayOrderByWithRelationInput;
        WhereUnique: Prisma.StudioOverlayWhereUniqueInput;
        Where: Prisma.StudioOverlayWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "spec";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
            spec: {
                Shape: StudioSpec;
                Name: "StudioSpec";
                Nullable: false;
            };
        };
    };
    StudioDeployment: {
        Name: "StudioDeployment";
        Shape: StudioDeployment;
        Include: Prisma.StudioDeploymentInclude;
        Select: Prisma.StudioDeploymentSelect;
        OrderBy: Prisma.StudioDeploymentOrderByWithRelationInput;
        WhereUnique: Prisma.StudioDeploymentWhereUniqueInput;
        Where: Prisma.StudioDeploymentWhereInput;
        Create: {};
        Update: {};
        RelationName: "project";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
        };
    };
    TaskCategory: {
        Name: "TaskCategory";
        Shape: TaskCategory;
        Include: Prisma.TaskCategoryInclude;
        Select: Prisma.TaskCategorySelect;
        OrderBy: Prisma.TaskCategoryOrderByWithRelationInput;
        WhereUnique: Prisma.TaskCategoryWhereUniqueInput;
        Where: Prisma.TaskCategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "tasks" | "project";
        ListRelations: "tasks";
        Relations: {
            tasks: {
                Shape: Task[];
                Name: "Task";
                Nullable: false;
            };
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
        };
    };
    Task: {
        Name: "Task";
        Shape: Task;
        Include: Prisma.TaskInclude;
        Select: Prisma.TaskSelect;
        OrderBy: Prisma.TaskOrderByWithRelationInput;
        WhereUnique: Prisma.TaskWhereUniqueInput;
        Where: Prisma.TaskWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "category";
        ListRelations: never;
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
            category: {
                Shape: TaskCategory | null;
                Name: "TaskCategory";
                Nullable: true;
            };
        };
    };
    Conversation: {
        Name: "Conversation";
        Shape: Conversation;
        Include: Prisma.ConversationInclude;
        Select: Prisma.ConversationSelect;
        OrderBy: Prisma.ConversationOrderByWithRelationInput;
        WhereUnique: Prisma.ConversationWhereUniqueInput;
        Where: Prisma.ConversationWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "messages" | "participants";
        ListRelations: "messages" | "participants";
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
            messages: {
                Shape: Message[];
                Name: "Message";
                Nullable: false;
            };
            participants: {
                Shape: ConversationParticipant[];
                Name: "ConversationParticipant";
                Nullable: false;
            };
        };
    };
    ConversationParticipant: {
        Name: "ConversationParticipant";
        Shape: ConversationParticipant;
        Include: Prisma.ConversationParticipantInclude;
        Select: Prisma.ConversationParticipantSelect;
        OrderBy: Prisma.ConversationParticipantOrderByWithRelationInput;
        WhereUnique: Prisma.ConversationParticipantWhereUniqueInput;
        Where: Prisma.ConversationParticipantWhereInput;
        Create: {};
        Update: {};
        RelationName: "conversation" | "project";
        ListRelations: never;
        Relations: {
            conversation: {
                Shape: Conversation;
                Name: "Conversation";
                Nullable: false;
            };
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
        };
    };
    Message: {
        Name: "Message";
        Shape: Message;
        Include: Prisma.MessageInclude;
        Select: Prisma.MessageSelect;
        OrderBy: Prisma.MessageOrderByWithRelationInput;
        WhereUnique: Prisma.MessageWhereUniqueInput;
        Where: Prisma.MessageWhereInput;
        Create: {};
        Update: {};
        RelationName: "conversation" | "project";
        ListRelations: never;
        Relations: {
            conversation: {
                Shape: Conversation;
                Name: "Conversation";
                Nullable: false;
            };
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
        };
    };
    RecipeCategory: {
        Name: "RecipeCategory";
        Shape: RecipeCategory;
        Include: Prisma.RecipeCategoryInclude;
        Select: Prisma.RecipeCategorySelect;
        OrderBy: Prisma.RecipeCategoryOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeCategoryWhereUniqueInput;
        Where: Prisma.RecipeCategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipes";
        ListRelations: "recipes";
        Relations: {
            recipes: {
                Shape: Recipe[];
                Name: "Recipe";
                Nullable: false;
            };
        };
    };
    Recipe: {
        Name: "Recipe";
        Shape: Recipe;
        Include: Prisma.RecipeInclude;
        Select: Prisma.RecipeSelect;
        OrderBy: Prisma.RecipeOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeWhereUniqueInput;
        Where: Prisma.RecipeWhereInput;
        Create: {};
        Update: {};
        RelationName: "project" | "category" | "ingredients" | "instructions";
        ListRelations: "ingredients" | "instructions";
        Relations: {
            project: {
                Shape: StudioProject;
                Name: "StudioProject";
                Nullable: false;
            };
            category: {
                Shape: RecipeCategory | null;
                Name: "RecipeCategory";
                Nullable: true;
            };
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
                Nullable: false;
            };
            instructions: {
                Shape: RecipeInstruction[];
                Name: "RecipeInstruction";
                Nullable: false;
            };
        };
    };
    RecipeIngredient: {
        Name: "RecipeIngredient";
        Shape: RecipeIngredient;
        Include: Prisma.RecipeIngredientInclude;
        Select: Prisma.RecipeIngredientSelect;
        OrderBy: Prisma.RecipeIngredientOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeIngredientWhereUniqueInput;
        Where: Prisma.RecipeIngredientWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe";
        ListRelations: never;
        Relations: {
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
        };
    };
    RecipeInstruction: {
        Name: "RecipeInstruction";
        Shape: RecipeInstruction;
        Include: Prisma.RecipeInstructionInclude;
        Select: Prisma.RecipeInstructionSelect;
        OrderBy: Prisma.RecipeInstructionOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeInstructionWhereUniqueInput;
        Where: Prisma.RecipeInstructionWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe";
        ListRelations: never;
        Relations: {
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
        };
    };
}
export function getDatamodel(): PothosPrismaDatamodel { return JSON.parse("{\"datamodel\":{\"models\":{\"EvolutionSession\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"EvolutionTrigger\",\"kind\":\"enum\",\"name\":\"trigger\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"EvolutionStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"signals\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"context\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"suggestions\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"appliedChanges\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"completedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"EvolutionSessionToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"StudioIntegration\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"IntegrationProvider\",\"kind\":\"enum\",\"name\":\"provider\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"enabled\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"credentials\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"config\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastUsed\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"usageCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToStudioIntegration\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioIntegrationToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"IntegrationConnection\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"integrationKey\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"integrationVersion\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"label\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"environment\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"IntegrationOwnershipMode\",\"kind\":\"enum\",\"name\":\"ownershipMode\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"externalAccountId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"secretProvider\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"secretRef\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"config\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"IntegrationConnectionStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"IntegrationConnectionStatus\",\"kind\":\"enum\",\"name\":\"healthStatus\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"healthCheckedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"healthLatencyMs\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"healthErrorCode\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"healthErrorMessage\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"usageRequestCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"usageSuccessCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"usageErrorCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"usageLastUsedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"usageLastSuccessAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"usageLastErrorAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"usageLastErrorCode\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"IntegrationConnectionToOrganization\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"KnowledgeSource\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"KnowledgeSourceType\",\"kind\":\"enum\",\"name\":\"type\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"url\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"content\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"embeddings\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"indexed\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastIndexed\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"KnowledgeSourceToOrganization\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"KnowledgeSourceToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Learner\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LearnerToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LearnerToOrganization\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"OnboardingProgress\",\"kind\":\"object\",\"name\":\"onboardingProgress\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LearnerToOnboardingProgress\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"organizationId\"]}]},\"OnboardingTrack\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"trackKey\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"productId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"targetUserSegment\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"targetRole\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isActive\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isRequired\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"canSkip\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"totalXp\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"completionXpBonus\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"completionBadgeKey\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"streakHoursWindow\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"streakBonusXp\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"OnboardingStep\",\"kind\":\"object\",\"name\":\"steps\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingStepToOnboardingTrack\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"OnboardingProgress\",\"kind\":\"object\",\"name\":\"progress\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingProgressToOnboardingTrack\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"OnboardingStep\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"trackId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"stepKey\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"instructions\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"helpUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"order\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"completionEvent\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"completionCondition\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"availability\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"xpReward\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isRequired\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"canSkip\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"actionUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"actionLabel\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"highlightSelector\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"tooltipPosition\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"OnboardingTrack\",\"kind\":\"object\",\"name\":\"track\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingStepToOnboardingTrack\",\"relationFromFields\":[\"trackId\"],\"isUpdatedAt\":false},{\"type\":\"OnboardingStepCompletion\",\"kind\":\"object\",\"name\":\"stepCompletions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingStepToOnboardingStepCompletion\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"trackId\",\"stepKey\"]}]},\"OnboardingProgress\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"learnerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"trackId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"progress\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isCompleted\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"xpEarned\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"completedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastActivityAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isDismissed\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"dismissedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Learner\",\"kind\":\"object\",\"name\":\"learner\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LearnerToOnboardingProgress\",\"relationFromFields\":[\"learnerId\"],\"isUpdatedAt\":false},{\"type\":\"OnboardingTrack\",\"kind\":\"object\",\"name\":\"track\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingProgressToOnboardingTrack\",\"relationFromFields\":[\"trackId\"],\"isUpdatedAt\":false},{\"type\":\"OnboardingStepCompletion\",\"kind\":\"object\",\"name\":\"stepCompletions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingProgressToOnboardingStepCompletion\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"learnerId\",\"trackId\"]}]},\"OnboardingStepCompletion\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"progressId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"stepId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OnboardingStepStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"xpEarned\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"triggeringEvent\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"eventPayload\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"completedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OnboardingProgress\",\"kind\":\"object\",\"name\":\"progress\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingProgressToOnboardingStepCompletion\",\"relationFromFields\":[\"progressId\"],\"isUpdatedAt\":false},{\"type\":\"OnboardingStep\",\"kind\":\"object\",\"name\":\"step\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OnboardingStepToOnboardingStepCompletion\",\"relationFromFields\":[\"stepId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"progressId\",\"stepId\"]}]},\"OrganizationLifecycleProfile\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"LifecycleStage\",\"kind\":\"enum\",\"name\":\"currentStage\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"LifecycleStage\",\"kind\":\"enum\",\"name\":\"detectedStage\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"confidence\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"productPhase\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"companyPhase\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"capitalPhase\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastAssessment\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"nextAssessment\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metrics\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"signals\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToOrganizationLifecycleProfile\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"LifecycleAssessment\",\"kind\":\"object\",\"name\":\"assessments\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LifecycleAssessmentToOrganizationLifecycleProfile\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"LifecycleMilestoneProgress\",\"kind\":\"object\",\"name\":\"milestones\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LifecycleMilestoneProgressToOrganizationLifecycleProfile\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"LifecycleAssessment\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"profileId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"LifecycleStage\",\"kind\":\"enum\",\"name\":\"stage\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"confidence\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"focusAreas\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"signals\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OrganizationLifecycleProfile\",\"kind\":\"object\",\"name\":\"profile\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LifecycleAssessmentToOrganizationLifecycleProfile\",\"relationFromFields\":[\"profileId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"LifecycleMilestoneProgress\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"profileId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"milestoneId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"category\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"MilestoneStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"completedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OrganizationLifecycleProfile\",\"kind\":\"object\",\"name\":\"profile\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LifecycleMilestoneProgressToOrganizationLifecycleProfile\",\"relationFromFields\":[\"profileId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"User\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"email\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"emailVerified\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"firstName\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"lastName\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"locale\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"timezone\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"imageUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"image\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"whitelistedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"onboardingCompleted\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"onboardingStep\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"role\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"banned\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"banReason\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"banExpires\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"phoneNumber\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"phoneNumberVerified\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Session\",\"kind\":\"object\",\"name\":\"sessions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"SessionToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Account\",\"kind\":\"object\",\"name\":\"accounts\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"AccountToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Member\",\"kind\":\"object\",\"name\":\"memberships\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MemberToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Invitation\",\"kind\":\"object\",\"name\":\"invitations\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"InvitationToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"TeamMember\",\"kind\":\"object\",\"name\":\"teamMemberships\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TeamMemberToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"PolicyBinding\",\"kind\":\"object\",\"name\":\"policyBindings\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PolicyBindingToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"ApiKey\",\"kind\":\"object\",\"name\":\"apiKeys\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ApiKeyToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Passkey\",\"kind\":\"object\",\"name\":\"passkeys\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PasskeyToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"SsoProvider\",\"kind\":\"object\",\"name\":\"ssoProviders\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"SsoProviderToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Learner\",\"kind\":\"object\",\"name\":\"learners\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LearnerToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Session\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"token\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"ipAddress\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userAgent\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"impersonatedBy\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"activeOrganizationId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"activeTeamId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"SessionToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Account\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"accountId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"providerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"accessToken\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"refreshToken\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"idToken\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"accessTokenExpiresAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"refreshTokenExpiresAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"scope\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"password\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"AccountToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"accountId\",\"providerId\"]}]},\"Verification\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"identifier\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"value\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Organization\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"logo\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"OrganizationType\",\"kind\":\"enum\",\"name\":\"type\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"onboardingCompleted\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"onboardingStep\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Member\",\"kind\":\"object\",\"name\":\"members\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MemberToOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Invitation\",\"kind\":\"object\",\"name\":\"invitations\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"InvitationToOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Team\",\"kind\":\"object\",\"name\":\"teams\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToTeam\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"PolicyBinding\",\"kind\":\"object\",\"name\":\"policyBindings\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToPolicyBinding\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"SsoProvider\",\"kind\":\"object\",\"name\":\"ssoProviders\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToSsoProvider\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"OrganizationLifecycleProfile\",\"kind\":\"object\",\"name\":\"lifecycleProfile\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToOrganizationLifecycleProfile\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"studioProjects\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioIntegration\",\"kind\":\"object\",\"name\":\"studioIntegrations\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToStudioIntegration\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"IntegrationConnection\",\"kind\":\"object\",\"name\":\"integrationConnections\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"IntegrationConnectionToOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"KnowledgeSource\",\"kind\":\"object\",\"name\":\"knowledgeSources\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"KnowledgeSourceToOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Learner\",\"kind\":\"object\",\"name\":\"learners\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"LearnerToOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"referralCode\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"referredBy\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Referral\",\"kind\":\"object\",\"name\":\"referrals\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ReferrerOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Referral\",\"kind\":\"object\",\"name\":\"referralReceived\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ReferredOrganization\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"ReferralReward\",\"kind\":\"object\",\"name\":\"referralRewards\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToReferralReward\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Member\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"role\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MemberToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MemberToOrganization\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"organizationId\"]}]},\"Invitation\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"InvitationToOrganization\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"email\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"role\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"acceptedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"inviterId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"inviter\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"InvitationToUser\",\"relationFromFields\":[\"inviterId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"teamId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Team\",\"kind\":\"object\",\"name\":\"team\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"InvitationToTeam\",\"relationFromFields\":[\"teamId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Team\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToTeam\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"TeamMember\",\"kind\":\"object\",\"name\":\"members\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TeamToTeamMember\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Invitation\",\"kind\":\"object\",\"name\":\"invitations\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"InvitationToTeam\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioProjectTeam\",\"kind\":\"object\",\"name\":\"studioProjectTeams\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectTeamToTeam\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"TeamMember\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"teamId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Team\",\"kind\":\"object\",\"name\":\"team\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TeamToTeamMember\",\"relationFromFields\":[\"teamId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TeamMemberToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Role\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"permissions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"PolicyBinding\",\"kind\":\"object\",\"name\":\"PolicyBinding\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PolicyBindingToRole\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Permission\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"PolicyBinding\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"roleId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"targetType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"targetId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Role\",\"kind\":\"object\",\"name\":\"role\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PolicyBindingToRole\",\"relationFromFields\":[\"roleId\"],\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"User\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PolicyBindingToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"Organization\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToPolicyBinding\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ApiKey\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"start\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"prefix\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"key\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"refillInterval\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"refillAmount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastRefillAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"enabled\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"rateLimitEnabled\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"rateLimitTimeWindow\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"rateLimitMax\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"requestCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"remaining\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastRequest\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"permissions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ApiKeyToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Passkey\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"publicKey\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"credentialID\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"counter\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"deviceType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"backedUp\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"transports\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"aaguid\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PasskeyToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"SsoProvider\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"issuer\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"domain\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"oidcConfig\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"samlConfig\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"providerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToSsoProvider\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"SsoProviderToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"OAuthApplication\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"clientId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"clientSecret\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"redirectURLs\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"type\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"disabled\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"OAuthAccessToken\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"accessToken\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"refreshToken\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"accessTokenExpiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"refreshTokenExpiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"clientId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"scopes\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"OAuthConsent\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"clientId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"scopes\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"consentGiven\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Referral\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"referrerOrganizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"referredOrganizationId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"referralCode\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ReferralStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"utmSource\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"utmMedium\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"utmCampaign\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"registeredAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"completedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"rewardedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"referrerOrganization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ReferrerOrganization\",\"relationFromFields\":[\"referrerOrganizationId\"],\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"referredOrganization\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ReferredOrganization\",\"relationFromFields\":[\"referredOrganizationId\"],\"isUpdatedAt\":false},{\"type\":\"ReferralReward\",\"kind\":\"object\",\"name\":\"rewards\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ReferralToReferralReward\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ReferralReward\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"referralId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ReferralRewardType\",\"kind\":\"enum\",\"name\":\"rewardType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"value\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"months\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isApplied\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"appliedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"stripeCouponId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToReferralReward\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"Referral\",\"kind\":\"object\",\"name\":\"referral\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ReferralToReferralReward\",\"relationFromFields\":[\"referralId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"StudioProject\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ProjectTier\",\"kind\":\"enum\",\"name\":\"tier\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DeploymentMode\",\"kind\":\"enum\",\"name\":\"deploymentMode\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"byokEnabled\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"byokConfig\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"evolutionEnabled\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"evolutionConfig\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"deletedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Organization\",\"kind\":\"object\",\"name\":\"organization\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrganizationToStudioProject\",\"relationFromFields\":[\"organizationId\"],\"isUpdatedAt\":false},{\"type\":\"StudioSpec\",\"kind\":\"object\",\"name\":\"specs\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToStudioSpec\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioOverlay\",\"kind\":\"object\",\"name\":\"overlays\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioOverlayToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioDeployment\",\"kind\":\"object\",\"name\":\"deployments\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioDeploymentToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioIntegration\",\"kind\":\"object\",\"name\":\"integrations\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioIntegrationToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"KnowledgeSource\",\"kind\":\"object\",\"name\":\"knowledgeSources\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"KnowledgeSourceToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"EvolutionSession\",\"kind\":\"object\",\"name\":\"evolutionSessions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"EvolutionSessionToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"TaskCategory\",\"kind\":\"object\",\"name\":\"taskCategories\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToTaskCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Task\",\"kind\":\"object\",\"name\":\"tasks\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToTask\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Conversation\",\"kind\":\"object\",\"name\":\"conversations\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"ConversationParticipant\",\"kind\":\"object\",\"name\":\"conversationParticipants\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationParticipantToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Message\",\"kind\":\"object\",\"name\":\"messages\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MessageToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Recipe\",\"kind\":\"object\",\"name\":\"recipes\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioProjectSlugAlias\",\"kind\":\"object\",\"name\":\"slugAliases\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToStudioProjectSlugAlias\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioLearningEvent\",\"kind\":\"object\",\"name\":\"learningEvents\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioLearningEventToStudioProject\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioProjectTeam\",\"kind\":\"object\",\"name\":\"teams\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToStudioProjectTeam\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"organizationId\",\"slug\"]}]},\"StudioProjectTeam\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"teamId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToStudioProjectTeam\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false},{\"type\":\"Team\",\"kind\":\"object\",\"name\":\"team\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectTeamToTeam\",\"relationFromFields\":[\"teamId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"projectId\",\"teamId\"]}]},\"StudioProjectSlugAlias\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToStudioProjectSlugAlias\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"organizationId\",\"slug\"]}]},\"StudioLearningEvent\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"organizationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"payload\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioLearningEventToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"StudioSpec\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"SpecType\",\"kind\":\"enum\",\"name\":\"type\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"version\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"content\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"metadata\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToStudioSpec\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false},{\"type\":\"StudioOverlay\",\"kind\":\"object\",\"name\":\"overlays\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioOverlayToStudioSpec\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"StudioOverlay\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"specId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"content\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioOverlayToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false},{\"type\":\"StudioSpec\",\"kind\":\"object\",\"name\":\"spec\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioOverlayToStudioSpec\",\"relationFromFields\":[\"specId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"StudioDeployment\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Environment\",\"kind\":\"enum\",\"name\":\"environment\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DeploymentStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"version\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"url\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"infrastructureId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"deployedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioDeploymentToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"TaskCategory\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"color\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Task\",\"kind\":\"object\",\"name\":\"tasks\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TaskToTaskCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToTaskCategory\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Task\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"categoryId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"completed\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"TaskPriority\",\"kind\":\"enum\",\"name\":\"priority\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"dueDate\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"tags\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"StudioProjectToTask\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false},{\"type\":\"TaskCategory\",\"kind\":\"object\",\"name\":\"category\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TaskToTaskCategory\",\"relationFromFields\":[\"categoryId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Conversation\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isGroup\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"avatarUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false},{\"type\":\"Message\",\"kind\":\"object\",\"name\":\"messages\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationToMessage\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"ConversationParticipant\",\"kind\":\"object\",\"name\":\"participants\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationToConversationParticipant\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"lastMessageId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ConversationParticipant\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"conversationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"displayName\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"role\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"joinedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastReadAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Conversation\",\"kind\":\"object\",\"name\":\"conversation\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationToConversationParticipant\",\"relationFromFields\":[\"conversationId\"],\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationParticipantToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"conversationId\",\"userId\"]}]},\"Message\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"conversationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"senderId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"senderName\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"content\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"attachments\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"MessageStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"Conversation\",\"kind\":\"object\",\"name\":\"conversation\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ConversationToMessage\",\"relationFromFields\":[\"conversationId\"],\"isUpdatedAt\":false},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MessageToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"RecipeCategory\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nameEn\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nameFr\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"icon\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Recipe\",\"kind\":\"object\",\"name\":\"recipes\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToRecipeCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Recipe\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"projectId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"categoryId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slugEn\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slugFr\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nameEn\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nameFr\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"descriptionEn\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"descriptionFr\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"heroImageUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"prepTimeMinutes\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"cookTimeMinutes\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"servings\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isFavorite\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"StudioProject\",\"kind\":\"object\",\"name\":\"project\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToStudioProject\",\"relationFromFields\":[\"projectId\"],\"isUpdatedAt\":false},{\"type\":\"RecipeCategory\",\"kind\":\"object\",\"name\":\"category\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToRecipeCategory\",\"relationFromFields\":[\"categoryId\"],\"isUpdatedAt\":false},{\"type\":\"RecipeIngredient\",\"kind\":\"object\",\"name\":\"ingredients\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToRecipeIngredient\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"RecipeInstruction\",\"kind\":\"object\",\"name\":\"instructions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToRecipeInstruction\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"RecipeIngredient\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"recipeId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nameEn\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nameFr\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"quantity\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"ordering\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Recipe\",\"kind\":\"object\",\"name\":\"recipe\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToRecipeIngredient\",\"relationFromFields\":[\"recipeId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"RecipeInstruction\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"recipeId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"contentEn\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"contentFr\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"ordering\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Recipe\",\"kind\":\"object\",\"name\":\"recipe\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RecipeToRecipeInstruction\",\"relationFromFields\":[\"recipeId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]}}}}"); }