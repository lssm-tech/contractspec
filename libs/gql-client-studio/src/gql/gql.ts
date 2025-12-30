/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  query PlatformAdminOrganizations(\n    $search: String!\n    $limit: Int!\n    $offset: Int!\n  ) {\n    platformAdminOrganizations(\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      id\n      name\n      slug\n      type\n      createdAt\n    }\n  }\n': typeof types.PlatformAdminOrganizationsDocument;
  '\n  query PlatformAdminIntegrationSpecs {\n    platformAdminIntegrationSpecs {\n      key\n      version\n      category\n      title\n      description\n      supportedModes\n      docsUrl\n      configSchema\n      secretSchema\n      byokSetup\n    }\n  }\n': typeof types.PlatformAdminIntegrationSpecsDocument;
  '\n  query PlatformAdminIntegrationConnections(\n    $input: PlatformIntegrationConnectionListInput!\n  ) {\n    platformAdminIntegrationConnections(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.PlatformAdminIntegrationConnectionsDocument;
  '\n  mutation PlatformAdminIntegrationConnectionCreate(\n    $input: PlatformIntegrationConnectionCreateInput!\n  ) {\n    platformAdminIntegrationConnectionCreate(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.PlatformAdminIntegrationConnectionCreateDocument;
  '\n  mutation PlatformAdminIntegrationConnectionUpdate(\n    $input: PlatformIntegrationConnectionUpdateInput!\n  ) {\n    platformAdminIntegrationConnectionUpdate(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.PlatformAdminIntegrationConnectionUpdateDocument;
  '\n  mutation PlatformAdminIntegrationConnectionDelete(\n    $targetOrganizationId: String!\n    $connectionId: String!\n  ) {\n    platformAdminIntegrationConnectionDelete(\n      targetOrganizationId: $targetOrganizationId\n      connectionId: $connectionId\n    )\n  }\n': typeof types.PlatformAdminIntegrationConnectionDeleteDocument;
  '\n  mutation SaveCanvasDraft($input: SaveCanvasDraftInput!) {\n    saveCanvasDraft(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n': typeof types.SaveCanvasDraftDocument;
  '\n  mutation DeployCanvasVersion($input: DeployCanvasVersionInput!) {\n    deployCanvasVersion(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n': typeof types.DeployCanvasVersionDocument;
  '\n  mutation UndoCanvasVersion($input: UndoCanvasInput!) {\n    undoCanvasVersion(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n': typeof types.UndoCanvasVersionDocument;
  '\n  mutation CreateStudioProject($input: CreateProjectInput!) {\n    createStudioProject(input: $input) {\n      id\n      slug\n      name\n      tier\n      deploymentMode\n    }\n  }\n': typeof types.CreateStudioProjectDocument;
  '\n  mutation CreateTeam($name: String!) {\n    createTeam(name: $name) {\n      id\n      name\n      organizationId\n    }\n  }\n': typeof types.CreateTeamDocument;
  '\n  mutation DeleteStudioProject($id: String!) {\n    deleteStudioProject(id: $id) {\n      id\n      slug\n      name\n    }\n  }\n': typeof types.DeleteStudioProjectDocument;
  '\n  mutation DeleteTeam($teamId: String!) {\n    deleteTeam(teamId: $teamId)\n  }\n': typeof types.DeleteTeamDocument;
  '\n  mutation DeployStudioProject($input: DeployProjectInput!) {\n    deployStudioProject(input: $input) {\n      id\n      environment\n      status\n      url\n    }\n  }\n': typeof types.DeployStudioProjectDocument;
  '\n  mutation DismissOnboardingTrack($trackKey: String!) {\n    dismissOnboardingTrack(trackKey: $trackKey) {\n      id\n      trackKey\n      isDismissed\n      dismissedAt\n    }\n  }\n': typeof types.DismissOnboardingTrackDocument;
  '\n  mutation StartEvolutionSession($input: StartEvolutionSessionInput!) {\n    startEvolutionSession(input: $input) {\n      id\n    }\n  }\n': typeof types.StartEvolutionSessionDocument;
  '\n  mutation UpdateEvolutionSession(\n    $id: String!\n    $input: UpdateEvolutionSessionInput!\n  ) {\n    updateEvolutionSession(id: $id, input: $input) {\n      id\n    }\n  }\n': typeof types.UpdateEvolutionSessionDocument;
  '\n  mutation ConnectIntegration($input: ConnectIntegrationInput!) {\n    connectIntegration(input: $input) {\n      id\n    }\n  }\n': typeof types.ConnectIntegrationDocument;
  '\n  mutation DisconnectIntegration($id: String!) {\n    disconnectIntegration(id: $id)\n  }\n': typeof types.DisconnectIntegrationDocument;
  '\n  mutation InviteToOrganization(\n    $email: String!\n    $role: String\n    $teamId: String\n  ) {\n    inviteToOrganization(email: $email, role: $role, teamId: $teamId) {\n      invitationId\n      inviteUrl\n      emailSent\n    }\n  }\n': typeof types.InviteToOrganizationDocument;
  '\n  mutation RecordLearningEvent($input: RecordLearningEventInput!) {\n    recordLearningEvent(input: $input) {\n      id\n    }\n  }\n': typeof types.RecordLearningEventDocument;
  '\n  mutation RenameTeam($teamId: String!, $name: String!) {\n    renameTeam(teamId: $teamId, name: $name) {\n      id\n      name\n      organizationId\n    }\n  }\n': typeof types.RenameTeamDocument;
  '\n  mutation CreateStudioSpec($input: CreateSpecInput!) {\n    createStudioSpec(input: $input) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n': typeof types.CreateStudioSpecDocument;
  '\n  mutation UpdateStudioSpec($id: String!, $input: UpdateSpecInput!) {\n    updateStudioSpec(id: $id, input: $input) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n': typeof types.UpdateStudioSpecDocument;
  '\n  mutation UpdateStudioProject($id: String!, $input: UpdateProjectInput!) {\n    updateStudioProject(id: $id, input: $input) {\n      id\n      slug\n      name\n      description\n      updatedAt\n    }\n  }\n': typeof types.UpdateStudioProjectDocument;
  '\n  query CanvasVersions($canvasId: String!) {\n    canvasVersions(canvasId: $canvasId) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n': typeof types.CanvasVersionsDocument;
  '\n  query EvolutionSessions($projectId: String!) {\n    evolutionSessions(projectId: $projectId) {\n      id\n      projectId\n      trigger\n      status\n      signals\n      context\n      suggestions\n      appliedChanges\n      startedAt\n      completedAt\n    }\n  }\n': typeof types.EvolutionSessionsDocument;
  '\n  query LifecycleProfile {\n    lifecycleProfile {\n      id\n      organizationId\n      currentStage\n      detectedStage\n      confidence\n      productPhase\n      companyPhase\n      capitalPhase\n      metrics\n      signals\n      lastAssessment\n      nextAssessment\n    }\n  }\n': typeof types.LifecycleProfileDocument;
  '\n  query MyLearningEvents($projectId: String!, $limit: Int!) {\n    myLearningEvents(projectId: $projectId, limit: $limit) {\n      id\n      organizationId\n      projectId\n      name\n      payload\n      createdAt\n    }\n  }\n': typeof types.MyLearningEventsDocument;
  '\n  query MyOnboardingProgress($trackKey: String!) {\n    myOnboardingProgress(trackKey: $trackKey) {\n      id\n      learnerId\n      trackId\n      trackKey\n      progress\n      isCompleted\n      xpEarned\n      startedAt\n      completedAt\n      lastActivityAt\n      isDismissed\n      dismissedAt\n      metadata\n      stepCompletions {\n        id\n        progressId\n        stepId\n        stepKey\n        status\n        xpEarned\n        completedAt\n      }\n    }\n  }\n': typeof types.MyOnboardingProgressDocument;
  '\n  query MyOnboardingTracks($productId: String, $includeProgress: Boolean!) {\n    myOnboardingTracks(\n      productId: $productId\n      includeProgress: $includeProgress\n    ) {\n      tracks {\n        id\n        trackKey\n        productId\n        name\n        description\n        targetUserSegment\n        targetRole\n        isActive\n        isRequired\n        canSkip\n        totalXp\n        completionXpBonus\n        completionBadgeKey\n        streakHoursWindow\n        streakBonusXp\n        metadata\n        steps {\n          id\n          trackId\n          stepKey\n          title\n          description\n          instructions\n          helpUrl\n          order\n          completionEvent\n          completionCondition\n          availability\n          xpReward\n          isRequired\n          canSkip\n          actionUrl\n          actionLabel\n          highlightSelector\n          tooltipPosition\n          metadata\n        }\n      }\n      progress {\n        id\n        learnerId\n        trackId\n        trackKey\n        progress\n        isCompleted\n        xpEarned\n        startedAt\n        completedAt\n        lastActivityAt\n        isDismissed\n        dismissedAt\n        metadata\n        stepCompletions {\n          id\n          progressId\n          stepId\n          stepKey\n          status\n          xpEarned\n          completedAt\n        }\n      }\n    }\n  }\n': typeof types.MyOnboardingTracksDocument;
  '\n  query MyTeams {\n    myTeams {\n      id\n      name\n      organizationId\n    }\n  }\n': typeof types.MyTeamsDocument;
  '\n  query OrganizationInvitations {\n    organizationInvitations {\n      id\n      organizationId\n      email\n      role\n      status\n      teamId\n      inviterId\n      createdAt\n      acceptedAt\n      expiresAt\n    }\n  }\n': typeof types.OrganizationInvitationsDocument;
  '\n  query ProjectSpecs($projectId: String!) {\n    projectSpecs(projectId: $projectId) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n': typeof types.ProjectSpecsDocument;
  '\n  query StudioCanvas($projectId: String!) {\n    studioCanvas(projectId: $projectId)\n  }\n': typeof types.StudioCanvasDocument;
  '\n  query StudioIntegrations($projectId: String!) {\n    studioIntegrations(projectId: $projectId) {\n      id\n      organizationId\n      projectId\n      provider\n      name\n      enabled\n      usageCount\n      lastUsed\n      config\n      createdAt\n    }\n  }\n': typeof types.StudioIntegrationsDocument;
  '\n  query StudioProjectBySlug($slug: String!) {\n    studioProjectBySlug(slug: $slug) {\n      canonicalSlug\n      wasRedirect\n      project {\n        id\n        slug\n        name\n        description\n        tier\n        deploymentMode\n        byokEnabled\n        evolutionEnabled\n        createdAt\n        updatedAt\n        deployments {\n          id\n          environment\n          status\n          version\n          url\n          createdAt\n          deployedAt\n        }\n      }\n    }\n  }\n': typeof types.StudioProjectBySlugDocument;
  '\n  query StudioProjects {\n    myStudioProjects {\n      id\n      slug\n      name\n      description\n      tier\n      deploymentMode\n      byokEnabled\n      evolutionEnabled\n      createdAt\n      updatedAt\n      specs {\n        id\n        type\n        version\n      }\n      deployments {\n        id\n        environment\n        status\n        deployedAt\n      }\n    }\n  }\n': typeof types.StudioProjectsDocument;
  '\n  query Hooks_MyActiveOrg {\n    myActiveOrganization {\n      id\n      name\n      slug\n      type\n    }\n  }\n': typeof types.Hooks_MyActiveOrgDocument;
};
const documents: Documents = {
  '\n  query PlatformAdminOrganizations(\n    $search: String!\n    $limit: Int!\n    $offset: Int!\n  ) {\n    platformAdminOrganizations(\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      id\n      name\n      slug\n      type\n      createdAt\n    }\n  }\n':
    types.PlatformAdminOrganizationsDocument,
  '\n  query PlatformAdminIntegrationSpecs {\n    platformAdminIntegrationSpecs {\n      key\n      version\n      category\n      title\n      description\n      supportedModes\n      docsUrl\n      configSchema\n      secretSchema\n      byokSetup\n    }\n  }\n':
    types.PlatformAdminIntegrationSpecsDocument,
  '\n  query PlatformAdminIntegrationConnections(\n    $input: PlatformIntegrationConnectionListInput!\n  ) {\n    platformAdminIntegrationConnections(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.PlatformAdminIntegrationConnectionsDocument,
  '\n  mutation PlatformAdminIntegrationConnectionCreate(\n    $input: PlatformIntegrationConnectionCreateInput!\n  ) {\n    platformAdminIntegrationConnectionCreate(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.PlatformAdminIntegrationConnectionCreateDocument,
  '\n  mutation PlatformAdminIntegrationConnectionUpdate(\n    $input: PlatformIntegrationConnectionUpdateInput!\n  ) {\n    platformAdminIntegrationConnectionUpdate(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.PlatformAdminIntegrationConnectionUpdateDocument,
  '\n  mutation PlatformAdminIntegrationConnectionDelete(\n    $targetOrganizationId: String!\n    $connectionId: String!\n  ) {\n    platformAdminIntegrationConnectionDelete(\n      targetOrganizationId: $targetOrganizationId\n      connectionId: $connectionId\n    )\n  }\n':
    types.PlatformAdminIntegrationConnectionDeleteDocument,
  '\n  mutation SaveCanvasDraft($input: SaveCanvasDraftInput!) {\n    saveCanvasDraft(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n':
    types.SaveCanvasDraftDocument,
  '\n  mutation DeployCanvasVersion($input: DeployCanvasVersionInput!) {\n    deployCanvasVersion(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n':
    types.DeployCanvasVersionDocument,
  '\n  mutation UndoCanvasVersion($input: UndoCanvasInput!) {\n    undoCanvasVersion(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n':
    types.UndoCanvasVersionDocument,
  '\n  mutation CreateStudioProject($input: CreateProjectInput!) {\n    createStudioProject(input: $input) {\n      id\n      slug\n      name\n      tier\n      deploymentMode\n    }\n  }\n':
    types.CreateStudioProjectDocument,
  '\n  mutation CreateTeam($name: String!) {\n    createTeam(name: $name) {\n      id\n      name\n      organizationId\n    }\n  }\n':
    types.CreateTeamDocument,
  '\n  mutation DeleteStudioProject($id: String!) {\n    deleteStudioProject(id: $id) {\n      id\n      slug\n      name\n    }\n  }\n':
    types.DeleteStudioProjectDocument,
  '\n  mutation DeleteTeam($teamId: String!) {\n    deleteTeam(teamId: $teamId)\n  }\n':
    types.DeleteTeamDocument,
  '\n  mutation DeployStudioProject($input: DeployProjectInput!) {\n    deployStudioProject(input: $input) {\n      id\n      environment\n      status\n      url\n    }\n  }\n':
    types.DeployStudioProjectDocument,
  '\n  mutation DismissOnboardingTrack($trackKey: String!) {\n    dismissOnboardingTrack(trackKey: $trackKey) {\n      id\n      trackKey\n      isDismissed\n      dismissedAt\n    }\n  }\n':
    types.DismissOnboardingTrackDocument,
  '\n  mutation StartEvolutionSession($input: StartEvolutionSessionInput!) {\n    startEvolutionSession(input: $input) {\n      id\n    }\n  }\n':
    types.StartEvolutionSessionDocument,
  '\n  mutation UpdateEvolutionSession(\n    $id: String!\n    $input: UpdateEvolutionSessionInput!\n  ) {\n    updateEvolutionSession(id: $id, input: $input) {\n      id\n    }\n  }\n':
    types.UpdateEvolutionSessionDocument,
  '\n  mutation ConnectIntegration($input: ConnectIntegrationInput!) {\n    connectIntegration(input: $input) {\n      id\n    }\n  }\n':
    types.ConnectIntegrationDocument,
  '\n  mutation DisconnectIntegration($id: String!) {\n    disconnectIntegration(id: $id)\n  }\n':
    types.DisconnectIntegrationDocument,
  '\n  mutation InviteToOrganization(\n    $email: String!\n    $role: String\n    $teamId: String\n  ) {\n    inviteToOrganization(email: $email, role: $role, teamId: $teamId) {\n      invitationId\n      inviteUrl\n      emailSent\n    }\n  }\n':
    types.InviteToOrganizationDocument,
  '\n  mutation RecordLearningEvent($input: RecordLearningEventInput!) {\n    recordLearningEvent(input: $input) {\n      id\n    }\n  }\n':
    types.RecordLearningEventDocument,
  '\n  mutation RenameTeam($teamId: String!, $name: String!) {\n    renameTeam(teamId: $teamId, name: $name) {\n      id\n      name\n      organizationId\n    }\n  }\n':
    types.RenameTeamDocument,
  '\n  mutation CreateStudioSpec($input: CreateSpecInput!) {\n    createStudioSpec(input: $input) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n':
    types.CreateStudioSpecDocument,
  '\n  mutation UpdateStudioSpec($id: String!, $input: UpdateSpecInput!) {\n    updateStudioSpec(id: $id, input: $input) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n':
    types.UpdateStudioSpecDocument,
  '\n  mutation UpdateStudioProject($id: String!, $input: UpdateProjectInput!) {\n    updateStudioProject(id: $id, input: $input) {\n      id\n      slug\n      name\n      description\n      updatedAt\n    }\n  }\n':
    types.UpdateStudioProjectDocument,
  '\n  query CanvasVersions($canvasId: String!) {\n    canvasVersions(canvasId: $canvasId) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n':
    types.CanvasVersionsDocument,
  '\n  query EvolutionSessions($projectId: String!) {\n    evolutionSessions(projectId: $projectId) {\n      id\n      projectId\n      trigger\n      status\n      signals\n      context\n      suggestions\n      appliedChanges\n      startedAt\n      completedAt\n    }\n  }\n':
    types.EvolutionSessionsDocument,
  '\n  query LifecycleProfile {\n    lifecycleProfile {\n      id\n      organizationId\n      currentStage\n      detectedStage\n      confidence\n      productPhase\n      companyPhase\n      capitalPhase\n      metrics\n      signals\n      lastAssessment\n      nextAssessment\n    }\n  }\n':
    types.LifecycleProfileDocument,
  '\n  query MyLearningEvents($projectId: String!, $limit: Int!) {\n    myLearningEvents(projectId: $projectId, limit: $limit) {\n      id\n      organizationId\n      projectId\n      name\n      payload\n      createdAt\n    }\n  }\n':
    types.MyLearningEventsDocument,
  '\n  query MyOnboardingProgress($trackKey: String!) {\n    myOnboardingProgress(trackKey: $trackKey) {\n      id\n      learnerId\n      trackId\n      trackKey\n      progress\n      isCompleted\n      xpEarned\n      startedAt\n      completedAt\n      lastActivityAt\n      isDismissed\n      dismissedAt\n      metadata\n      stepCompletions {\n        id\n        progressId\n        stepId\n        stepKey\n        status\n        xpEarned\n        completedAt\n      }\n    }\n  }\n':
    types.MyOnboardingProgressDocument,
  '\n  query MyOnboardingTracks($productId: String, $includeProgress: Boolean!) {\n    myOnboardingTracks(\n      productId: $productId\n      includeProgress: $includeProgress\n    ) {\n      tracks {\n        id\n        trackKey\n        productId\n        name\n        description\n        targetUserSegment\n        targetRole\n        isActive\n        isRequired\n        canSkip\n        totalXp\n        completionXpBonus\n        completionBadgeKey\n        streakHoursWindow\n        streakBonusXp\n        metadata\n        steps {\n          id\n          trackId\n          stepKey\n          title\n          description\n          instructions\n          helpUrl\n          order\n          completionEvent\n          completionCondition\n          availability\n          xpReward\n          isRequired\n          canSkip\n          actionUrl\n          actionLabel\n          highlightSelector\n          tooltipPosition\n          metadata\n        }\n      }\n      progress {\n        id\n        learnerId\n        trackId\n        trackKey\n        progress\n        isCompleted\n        xpEarned\n        startedAt\n        completedAt\n        lastActivityAt\n        isDismissed\n        dismissedAt\n        metadata\n        stepCompletions {\n          id\n          progressId\n          stepId\n          stepKey\n          status\n          xpEarned\n          completedAt\n        }\n      }\n    }\n  }\n':
    types.MyOnboardingTracksDocument,
  '\n  query MyTeams {\n    myTeams {\n      id\n      name\n      organizationId\n    }\n  }\n':
    types.MyTeamsDocument,
  '\n  query OrganizationInvitations {\n    organizationInvitations {\n      id\n      organizationId\n      email\n      role\n      status\n      teamId\n      inviterId\n      createdAt\n      acceptedAt\n      expiresAt\n    }\n  }\n':
    types.OrganizationInvitationsDocument,
  '\n  query ProjectSpecs($projectId: String!) {\n    projectSpecs(projectId: $projectId) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n':
    types.ProjectSpecsDocument,
  '\n  query StudioCanvas($projectId: String!) {\n    studioCanvas(projectId: $projectId)\n  }\n':
    types.StudioCanvasDocument,
  '\n  query StudioIntegrations($projectId: String!) {\n    studioIntegrations(projectId: $projectId) {\n      id\n      organizationId\n      projectId\n      provider\n      name\n      enabled\n      usageCount\n      lastUsed\n      config\n      createdAt\n    }\n  }\n':
    types.StudioIntegrationsDocument,
  '\n  query StudioProjectBySlug($slug: String!) {\n    studioProjectBySlug(slug: $slug) {\n      canonicalSlug\n      wasRedirect\n      project {\n        id\n        slug\n        name\n        description\n        tier\n        deploymentMode\n        byokEnabled\n        evolutionEnabled\n        createdAt\n        updatedAt\n        deployments {\n          id\n          environment\n          status\n          version\n          url\n          createdAt\n          deployedAt\n        }\n      }\n    }\n  }\n':
    types.StudioProjectBySlugDocument,
  '\n  query StudioProjects {\n    myStudioProjects {\n      id\n      slug\n      name\n      description\n      tier\n      deploymentMode\n      byokEnabled\n      evolutionEnabled\n      createdAt\n      updatedAt\n      specs {\n        id\n        type\n        version\n      }\n      deployments {\n        id\n        environment\n        status\n        deployedAt\n      }\n    }\n  }\n':
    types.StudioProjectsDocument,
  '\n  query Hooks_MyActiveOrg {\n    myActiveOrganization {\n      id\n      name\n      slug\n      type\n    }\n  }\n':
    types.Hooks_MyActiveOrgDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PlatformAdminOrganizations(\n    $search: String!\n    $limit: Int!\n    $offset: Int!\n  ) {\n    platformAdminOrganizations(\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      id\n      name\n      slug\n      type\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').PlatformAdminOrganizationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PlatformAdminIntegrationSpecs {\n    platformAdminIntegrationSpecs {\n      key\n      version\n      category\n      title\n      description\n      supportedModes\n      docsUrl\n      configSchema\n      secretSchema\n      byokSetup\n    }\n  }\n'
): typeof import('./graphql').PlatformAdminIntegrationSpecsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PlatformAdminIntegrationConnections(\n    $input: PlatformIntegrationConnectionListInput!\n  ) {\n    platformAdminIntegrationConnections(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').PlatformAdminIntegrationConnectionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PlatformAdminIntegrationConnectionCreate(\n    $input: PlatformIntegrationConnectionCreateInput!\n  ) {\n    platformAdminIntegrationConnectionCreate(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').PlatformAdminIntegrationConnectionCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PlatformAdminIntegrationConnectionUpdate(\n    $input: PlatformIntegrationConnectionUpdateInput!\n  ) {\n    platformAdminIntegrationConnectionUpdate(input: $input) {\n      id\n      organizationId\n      integrationKey\n      integrationVersion\n      label\n      environment\n      ownershipMode\n      externalAccountId\n      secretProvider\n      secretRef\n      config\n      status\n      createdAt\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').PlatformAdminIntegrationConnectionUpdateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PlatformAdminIntegrationConnectionDelete(\n    $targetOrganizationId: String!\n    $connectionId: String!\n  ) {\n    platformAdminIntegrationConnectionDelete(\n      targetOrganizationId: $targetOrganizationId\n      connectionId: $connectionId\n    )\n  }\n'
): typeof import('./graphql').PlatformAdminIntegrationConnectionDeleteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SaveCanvasDraft($input: SaveCanvasDraftInput!) {\n    saveCanvasDraft(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n'
): typeof import('./graphql').SaveCanvasDraftDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeployCanvasVersion($input: DeployCanvasVersionInput!) {\n    deployCanvasVersion(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n'
): typeof import('./graphql').DeployCanvasVersionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UndoCanvasVersion($input: UndoCanvasInput!) {\n    undoCanvasVersion(input: $input) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n'
): typeof import('./graphql').UndoCanvasVersionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateStudioProject($input: CreateProjectInput!) {\n    createStudioProject(input: $input) {\n      id\n      slug\n      name\n      tier\n      deploymentMode\n    }\n  }\n'
): typeof import('./graphql').CreateStudioProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateTeam($name: String!) {\n    createTeam(name: $name) {\n      id\n      name\n      organizationId\n    }\n  }\n'
): typeof import('./graphql').CreateTeamDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteStudioProject($id: String!) {\n    deleteStudioProject(id: $id) {\n      id\n      slug\n      name\n    }\n  }\n'
): typeof import('./graphql').DeleteStudioProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteTeam($teamId: String!) {\n    deleteTeam(teamId: $teamId)\n  }\n'
): typeof import('./graphql').DeleteTeamDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeployStudioProject($input: DeployProjectInput!) {\n    deployStudioProject(input: $input) {\n      id\n      environment\n      status\n      url\n    }\n  }\n'
): typeof import('./graphql').DeployStudioProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DismissOnboardingTrack($trackKey: String!) {\n    dismissOnboardingTrack(trackKey: $trackKey) {\n      id\n      trackKey\n      isDismissed\n      dismissedAt\n    }\n  }\n'
): typeof import('./graphql').DismissOnboardingTrackDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation StartEvolutionSession($input: StartEvolutionSessionInput!) {\n    startEvolutionSession(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').StartEvolutionSessionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateEvolutionSession(\n    $id: String!\n    $input: UpdateEvolutionSessionInput!\n  ) {\n    updateEvolutionSession(id: $id, input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').UpdateEvolutionSessionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ConnectIntegration($input: ConnectIntegrationInput!) {\n    connectIntegration(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').ConnectIntegrationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DisconnectIntegration($id: String!) {\n    disconnectIntegration(id: $id)\n  }\n'
): typeof import('./graphql').DisconnectIntegrationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation InviteToOrganization(\n    $email: String!\n    $role: String\n    $teamId: String\n  ) {\n    inviteToOrganization(email: $email, role: $role, teamId: $teamId) {\n      invitationId\n      inviteUrl\n      emailSent\n    }\n  }\n'
): typeof import('./graphql').InviteToOrganizationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RecordLearningEvent($input: RecordLearningEventInput!) {\n    recordLearningEvent(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').RecordLearningEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RenameTeam($teamId: String!, $name: String!) {\n    renameTeam(teamId: $teamId, name: $name) {\n      id\n      name\n      organizationId\n    }\n  }\n'
): typeof import('./graphql').RenameTeamDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateStudioSpec($input: CreateSpecInput!) {\n    createStudioSpec(input: $input) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').CreateStudioSpecDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateStudioSpec($id: String!, $input: UpdateSpecInput!) {\n    updateStudioSpec(id: $id, input: $input) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').UpdateStudioSpecDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateStudioProject($id: String!, $input: UpdateProjectInput!) {\n    updateStudioProject(id: $id, input: $input) {\n      id\n      slug\n      name\n      description\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').UpdateStudioProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CanvasVersions($canvasId: String!) {\n    canvasVersions(canvasId: $canvasId) {\n      id\n      label\n      status\n      nodes\n      createdAt\n      createdBy\n    }\n  }\n'
): typeof import('./graphql').CanvasVersionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query EvolutionSessions($projectId: String!) {\n    evolutionSessions(projectId: $projectId) {\n      id\n      projectId\n      trigger\n      status\n      signals\n      context\n      suggestions\n      appliedChanges\n      startedAt\n      completedAt\n    }\n  }\n'
): typeof import('./graphql').EvolutionSessionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query LifecycleProfile {\n    lifecycleProfile {\n      id\n      organizationId\n      currentStage\n      detectedStage\n      confidence\n      productPhase\n      companyPhase\n      capitalPhase\n      metrics\n      signals\n      lastAssessment\n      nextAssessment\n    }\n  }\n'
): typeof import('./graphql').LifecycleProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyLearningEvents($projectId: String!, $limit: Int!) {\n    myLearningEvents(projectId: $projectId, limit: $limit) {\n      id\n      organizationId\n      projectId\n      name\n      payload\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').MyLearningEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyOnboardingProgress($trackKey: String!) {\n    myOnboardingProgress(trackKey: $trackKey) {\n      id\n      learnerId\n      trackId\n      trackKey\n      progress\n      isCompleted\n      xpEarned\n      startedAt\n      completedAt\n      lastActivityAt\n      isDismissed\n      dismissedAt\n      metadata\n      stepCompletions {\n        id\n        progressId\n        stepId\n        stepKey\n        status\n        xpEarned\n        completedAt\n      }\n    }\n  }\n'
): typeof import('./graphql').MyOnboardingProgressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyOnboardingTracks($productId: String, $includeProgress: Boolean!) {\n    myOnboardingTracks(\n      productId: $productId\n      includeProgress: $includeProgress\n    ) {\n      tracks {\n        id\n        trackKey\n        productId\n        name\n        description\n        targetUserSegment\n        targetRole\n        isActive\n        isRequired\n        canSkip\n        totalXp\n        completionXpBonus\n        completionBadgeKey\n        streakHoursWindow\n        streakBonusXp\n        metadata\n        steps {\n          id\n          trackId\n          stepKey\n          title\n          description\n          instructions\n          helpUrl\n          order\n          completionEvent\n          completionCondition\n          availability\n          xpReward\n          isRequired\n          canSkip\n          actionUrl\n          actionLabel\n          highlightSelector\n          tooltipPosition\n          metadata\n        }\n      }\n      progress {\n        id\n        learnerId\n        trackId\n        trackKey\n        progress\n        isCompleted\n        xpEarned\n        startedAt\n        completedAt\n        lastActivityAt\n        isDismissed\n        dismissedAt\n        metadata\n        stepCompletions {\n          id\n          progressId\n          stepId\n          stepKey\n          status\n          xpEarned\n          completedAt\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').MyOnboardingTracksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyTeams {\n    myTeams {\n      id\n      name\n      organizationId\n    }\n  }\n'
): typeof import('./graphql').MyTeamsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query OrganizationInvitations {\n    organizationInvitations {\n      id\n      organizationId\n      email\n      role\n      status\n      teamId\n      inviterId\n      createdAt\n      acceptedAt\n      expiresAt\n    }\n  }\n'
): typeof import('./graphql').OrganizationInvitationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ProjectSpecs($projectId: String!) {\n    projectSpecs(projectId: $projectId) {\n      id\n      projectId\n      type\n      name\n      version\n      content\n      metadata\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').ProjectSpecsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query StudioCanvas($projectId: String!) {\n    studioCanvas(projectId: $projectId)\n  }\n'
): typeof import('./graphql').StudioCanvasDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query StudioIntegrations($projectId: String!) {\n    studioIntegrations(projectId: $projectId) {\n      id\n      organizationId\n      projectId\n      provider\n      name\n      enabled\n      usageCount\n      lastUsed\n      config\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').StudioIntegrationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query StudioProjectBySlug($slug: String!) {\n    studioProjectBySlug(slug: $slug) {\n      canonicalSlug\n      wasRedirect\n      project {\n        id\n        slug\n        name\n        description\n        tier\n        deploymentMode\n        byokEnabled\n        evolutionEnabled\n        createdAt\n        updatedAt\n        deployments {\n          id\n          environment\n          status\n          version\n          url\n          createdAt\n          deployedAt\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').StudioProjectBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query StudioProjects {\n    myStudioProjects {\n      id\n      slug\n      name\n      description\n      tier\n      deploymentMode\n      byokEnabled\n      evolutionEnabled\n      createdAt\n      updatedAt\n      specs {\n        id\n        type\n        version\n      }\n      deployments {\n        id\n        environment\n        status\n        deployedAt\n      }\n    }\n  }\n'
): typeof import('./graphql').StudioProjectsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Hooks_MyActiveOrg {\n    myActiveOrganization {\n      id\n      name\n      slug\n      type\n    }\n  }\n'
): typeof import('./graphql').Hooks_MyActiveOrgDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
