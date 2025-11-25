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
  '\n  query page_CollectivityDashboardMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n': typeof types.Page_CollectivityDashboardMetricsQueryDocument;
  '\n  query page_CollectivityMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n': typeof types.Page_CollectivityMetricsQueryDocument;
  '\n  query page_CollectivityOverview_Cities($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n': typeof types.Page_CollectivityOverview_CitiesDocument;
  '\n  fragment CityOverview on City {\n    id\n    name\n  }\n': typeof types.CityOverviewFragmentDoc;
  '\n  query page_CollectivityOverview_Availabilities($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      ...SpotAvailability_ListItem\n    }\n  }\n': typeof types.Page_CollectivityOverview_AvailabilitiesDocument;
  '\n  query CollectivityPrivacy_MyGdprRequestsQuery {\n    myGdprRequests {\n      id\n      type\n      status\n      createdAt\n      metadata\n    }\n  }\n': typeof types.CollectivityPrivacy_MyGdprRequestsQueryDocument;
  '\n  mutation CollectivityPrivacy_RequestDataExportMutation {\n    requestDataExport {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n': typeof types.CollectivityPrivacy_RequestDataExportMutationDocument;
  '\n  mutation CollectivityPrivacy_RequestAccountDeletionMutation(\n    $input: RequestAccountDeletionInput!\n  ) {\n    requestAccountDeletion(input: $input) {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n': typeof types.CollectivityPrivacy_RequestAccountDeletionMutationDocument;
  '\n  query page_CollectivitySpotDefinition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      id\n      name\n      status\n      description\n      city {\n        id\n        name\n      }\n    }\n  }\n': typeof types.Page_CollectivitySpotDefinitionDocument;
  '\n  query page_CollectivityCitiesQuery($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n': typeof types.Page_CollectivityCitiesQueryDocument;
  '\n  query page_CollectivitySpots_Availabilities($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      ...SpotAvailability_ListItem\n    }\n  }\n': typeof types.Page_CollectivitySpots_AvailabilitiesDocument;
  '\n  query page_CollectivitySpotDefinitions($q: String, $cityId: ID, $limit: Int) {\n    spotDefinitions(input: { q: $q, cityId: $cityId, limit: $limit }) {\n      ...SpotDefinition_Basic\n      spotAvailabilityDefinition {\n        id\n        timezone\n        startDate\n        frequency\n        interval\n        byWeekday\n        byMonthday\n        endsCount\n        endsAt\n        isActive\n        feeReference\n        maxCapacity\n      }\n    }\n  }\n': typeof types.Page_CollectivitySpotDefinitionsDocument;
  '\n  mutation page_CollectivitySetSpotDefinitionPublish(\n    $id: ID!\n    $publish: Boolean!\n  ) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n': typeof types.Page_CollectivitySetSpotDefinitionPublishDocument;
  '\n  query page_PlatformAdminBookingsQuery($first: Int, $after: String) {\n    adminBookings(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          status\n          bookedAt\n          spotAvailability {\n            date\n          }\n          spotDefinition {\n            name\n            latitude\n            longitude\n            city {\n              name\n            }\n          }\n          seller {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n': typeof types.Page_PlatformAdminBookingsQueryDocument;
  '\n  query Page_AdminCollectivityDetails($id: ID!) {\n    adminCollectivity(input: { id: $id }) {\n      id\n      name\n      siret\n    }\n  }\n': typeof types.Page_AdminCollectivityDetailsDocument;
  '\n  mutation Page_AdminInvite($input: AdminInviteInput!) {\n    adminInviteToCollectivity(input: $input)\n  }\n': typeof types.Page_AdminInviteDocument;
  '\n  mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {\n    adminAppendCollectivityNote(input: $input)\n  }\n': typeof types.Page_AdminAppendNoteDocument;
  '\n    query Page_AdminCollectivities {\n      adminCollectivities {\n        id\n        name\n        siret\n      }\n    }\n  ': typeof types.Page_AdminCollectivitiesDocument;
  '\n    mutation Page_AdminInvite($input: AdminInviteInput!) {\n      adminInviteToCollectivity(input: $input)\n    }\n  ': typeof types.Page_AdminInviteDocument;
  '\n    mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {\n      adminAppendCollectivityNote(input: $input)\n    }\n  ': typeof types.Page_AdminAppendNoteDocument;
  '\n    mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {\n      adminCreateOrganization(input: $input) {\n        id\n      }\n    }\n  ': typeof types.Page_AdminCreateOrgDocument;
  '\n  query AdminContentListQuery {\n    adminContentList {\n      id\n      isPublished\n      locales {\n        locale\n        slug\n        title\n        summary\n      }\n    }\n  }\n': typeof types.AdminContentListQueryDocument;
  '\n  mutation AdminUpsertContentMutation($input: AdminUpsertContentInput!) {\n    adminUpsertContent(input: $input) {\n      id\n    }\n  }\n': typeof types.AdminUpsertContentMutationDocument;
  '\n  mutation AdminTranslateContentMutation($input: AdminTranslateContentInput!) {\n    adminTranslateContent(input: $input) {\n      id\n    }\n  }\n': typeof types.AdminTranslateContentMutationDocument;
  '\n  query page_PlatformAdminDashboardMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n': typeof types.Page_PlatformAdminDashboardMetricsQueryDocument;
  '\n  query page_PlatformAdminUsersQuery($page: Int, $limit: Int) {\n    adminUsersWithCompliance(page: $page, limit: $limit) {\n      items {\n        id\n        firstName\n        lastName\n        email\n        uploadedDocCount\n        lastUploadAt\n        complianceBadge\n      }\n      totalItems\n      totalPages\n    }\n  }\n': typeof types.Page_PlatformAdminUsersQueryDocument;
  '\n  query page_PlatformAdminMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n': typeof types.Page_PlatformAdminMetricsQueryDocument;
  '\n  query page_PlatformAdminOrdersQuery($first: Int, $after: String) {\n    adminWholesaleOrders(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          createdAt\n          totalAmount\n          currency\n          status\n          sellerId\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n': typeof types.Page_PlatformAdminOrdersQueryDocument;
  '\n  query Page_AdminSellers {\n    adminSellers {\n      id\n      name\n      siret\n      createdAt\n      complianceBadge\n    }\n  }\n': typeof types.Page_AdminSellersDocument;
  '\n    query Page_AdminSellers {\n      adminSellers {\n        id\n        name\n        siret\n        createdAt\n        complianceBadge\n      }\n    }\n  ': typeof types.Page_AdminSellersDocument;
  '\n        mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {\n          adminCreateOrganization(input: $input) {\n            id\n          }\n        }\n      ': typeof types.Page_AdminCreateOrgDocument;
  '\n  query page_Admin_CitiesQuery($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n': typeof types.Page_Admin_CitiesQueryDocument;
  '\n  query page_Admin_AvailabilitiesByCityDateQuery($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          city {\n            id\n            name\n          }\n          latitude\n          longitude\n          status\n        }\n      }\n    }\n  }\n': typeof types.Page_Admin_AvailabilitiesByCityDateQueryDocument;
  '\n  mutation page_AdminSetSpotDefinitionPublish($id: ID!, $publish: Boolean!) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n': typeof types.Page_AdminSetSpotDefinitionPublishDocument;
  '\n  query AdminUserDetails($userId: ID!) {\n    adminUserDetails(userId: $userId) {\n      id\n      email\n      name\n      phoneNumber\n      createdAt\n      updatedAt\n      lastLoginAt\n      status\n      emailVerified\n      phoneVerified\n      profile {\n        firstName\n        lastName\n        dateOfBirth\n        address {\n          street\n          city\n          postalCode\n          country\n        }\n        profession\n        companyName\n        siret\n      }\n      kyc {\n        status\n        level\n        verifiedAt\n        reviewedBy\n        reviewNotes\n        documents {\n          id\n          documentType\n          status\n          fileName\n          updatedAt\n        }\n        riskScore\n        lastReviewAt\n      }\n      metrics {\n        totalLogins\n        lastActivityAt\n        documentsUploaded\n        organizationsCount\n        subscriptionStatus\n        lifetimeValue\n      }\n      organizations {\n        id\n        name\n        role\n        joinedAt\n      }\n    }\n  }\n': typeof types.AdminUserDetailsDocument;
  '\n  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {\n    updateUserProfile(userId: $userId, input: $input) {\n      id\n      name\n      email\n      phoneNumber\n      status\n    }\n  }\n': typeof types.UpdateUserProfileDocument;
  '\n  mutation ReviewKYC($userId: ID!, $input: ReviewKYCInput!) {\n    reviewKYC(userId: $userId, input: $input) {\n      id\n      status\n      level\n      reviewNotes\n      verifiedAt\n    }\n  }\n': typeof types.ReviewKycDocument;
  '\n  mutation ReviewDocument($input: ReviewDocumentInput!) {\n    reviewDocument(input: $input) {\n      id\n      status\n      verifiedAt\n      reviewNotes\n    }\n  }\n': typeof types.ReviewDocumentDocument;
  '\n  mutation Page_AdminCreateUser($input: AdminCreateUserInput!) {\n    adminCreateUser(input: $input)\n  }\n': typeof types.Page_AdminCreateUserDocument;
  '\n  query Page_AdminCollectivities {\n    adminCollectivities {\n      id\n      name\n      siret\n    }\n  }\n': typeof types.Page_AdminCollectivitiesDocument;
  '\n  query page_PlatformAdminWaitingListQuery {\n    adminWaitingList {\n      items {\n        id\n        email\n        createdAt\n        firstName\n        lastName\n      }\n    }\n  }\n': typeof types.Page_PlatformAdminWaitingListQueryDocument;
  '\n  mutation AdminAllowWaitlist($input: AdminAllowWaitlistInput!) {\n    adminAllowWaitlistEntry(input: $input)\n  }\n': typeof types.AdminAllowWaitlistDocument;
  '\n      query Dashboard_SellerComplianceQuery {\n        sellerCompliance {\n          sellerId\n          badge\n          missingCore\n          expiring\n          uploadedCount\n          hasVerifiedKBIS\n          hasVerifiedUser\n        }\n      }\n    ': typeof types.Dashboard_SellerComplianceQueryDocument;
  '\n  query page_SellerDocsQuery {\n    myDocuments {\n      id\n      documentType\n      status\n      expiryDate\n    }\n  }\n': typeof types.Page_SellerDocsQueryDocument;
  '\n  mutation page_UploadDocMutation($input: UploadDocumentInput!) {\n    uploadDocument(input: $input) {\n      id\n      status\n    }\n  }\n': typeof types.Page_UploadDocMutationDocument;
  '\n      query Profile_UserKycStatusQuery {\n        userKycStatus {\n          phoneVerified\n          hasVerifiedIdDocument\n          isVerified\n        }\n      }\n    ': typeof types.Profile_UserKycStatusQueryDocument;
  '\n  query SellerPrivacy_MyGdprRequestsQuery {\n    myGdprRequests {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n': typeof types.SellerPrivacy_MyGdprRequestsQueryDocument;
  '\n  mutation SellerPrivacy_RequestDataExportMutation {\n    requestDataExport {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n': typeof types.SellerPrivacy_RequestDataExportMutationDocument;
  '\n  mutation SellerPrivacy_RequestAccountDeletionMutation(\n    $input: RequestAccountDeletionInput!\n  ) {\n    requestAccountDeletion(input: $input) {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n': typeof types.SellerPrivacy_RequestAccountDeletionMutationDocument;
  '\n  fragment SellerSpot_Detail on SpotDefinition {\n    id\n    name\n    description\n    status\n    city {\n      id\n      ...City_Basic\n    }\n  }\n': typeof types.SellerSpot_DetailFragmentDoc;
  '\n  query page_SellerSpotDetail($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      ...SellerSpot_Detail\n    }\n  }\n': typeof types.Page_SellerSpotDetailDocument;
  '\n  mutation page_SellerBookSpot($availabilityId: ID!) {\n    bookAvailability(input: { availabilityId: $availabilityId }) {\n      id\n      status\n      bookedAt\n    }\n  }\n': typeof types.Page_SellerBookSpotDocument;
  '\n  query page_SellerAvailabilitiesQuery($date: Date!, $q: String) {\n    availabilitiesByCityDate(input: { date: $date }) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          latitude\n          longitude\n          city {\n            name\n          }\n        }\n      }\n    }\n  }\n': typeof types.Page_SellerAvailabilitiesQueryDocument;
  '\n  mutation page_SellerAvailabilities_Book($availabilityId: ID!) {\n    bookAvailability(input: { availabilityId: $availabilityId }) {\n      id\n      status\n    }\n  }\n': typeof types.Page_SellerAvailabilities_BookDocument;
  '\n  mutation page_WholesaleCheckoutMutation($input: WholesaleCheckoutInput!) {\n    wholesaleCheckout(input: $input) {\n      id\n      status\n      totalAmount\n      currency\n    }\n  }\n': typeof types.Page_WholesaleCheckoutMutationDocument;
  '\n  fragment Country_Basic on PublicCountry {\n    id\n    name\n    code\n  }\n': typeof types.Country_BasicFragmentDoc;
  '\n  fragment City_Basic on City {\n    id\n    name\n    code\n  }\n': typeof types.City_BasicFragmentDoc;
  '\n  fragment Address_Basic on PublicAddress {\n    id\n    addressLine1\n    addressLine2\n    postalCode\n  }\n': typeof types.Address_BasicFragmentDoc;
  '\n  fragment SpotDefinition_Basic on SpotDefinition {\n    id\n    name\n    description\n    status\n    latitude\n    longitude\n    updatedAt\n    city {\n      ...City_Basic\n    }\n  }\n': typeof types.SpotDefinition_BasicFragmentDoc;
  '\n  fragment SpotAvailability_ListItem on SpotAvailability {\n    id\n    date\n    status\n    spotDefinition {\n      id\n      ...SpotDefinition_Basic\n    }\n  }\n': typeof types.SpotAvailability_ListItemFragmentDoc;
  '\n  fragment Booking_ListItem on Booking {\n    id\n    status\n    bookedAt\n    complianceBadgeAtBooking\n  }\n': typeof types.Booking_ListItemFragmentDoc;
  '\n  query page_StritMeForOnboardingManager {\n    me {\n      id\n      onboardingCompleted\n      onboardingStep\n      metadata\n    }\n    myOrganizations {\n      id\n      name\n      type\n      onboardingCompleted\n      onboardingStep\n    }\n  }\n': typeof types.Page_StritMeForOnboardingManagerDocument;
  '\n          mutation Auth_Unlink($providerId: String!) {\n            unlinkProvider(providerId: $providerId)\n          }\n        ': typeof types.Auth_UnlinkDocument;
  '\n      query Auth_ConnectionStatus {\n        connectionStatus {\n          linkedProviders\n        }\n      }\n    ': typeof types.Auth_ConnectionStatusDocument;
  '\n  query page_SellerBookingsQuery {\n    myBookings {\n      id\n      status\n      bookedAt\n      spotAvailability {\n        date\n        spotAvailabilityDefinition {\n          feeReference\n          maxCapacity\n        }\n      }\n      spotDefinition {\n        name\n        latitude\n        longitude\n        city {\n          name\n        }\n      }\n    }\n  }\n': typeof types.Page_SellerBookingsQueryDocument;
  '\n  mutation page_SellerBookings_Cancel($id: ID!) {\n    cancelBooking(input: { id: $id }) {\n      id\n      status\n      cancelledAt\n    }\n  }\n': typeof types.Page_SellerBookings_CancelDocument;
  '\n  fragment SpotDetailHeader_Spot on SpotDefinition {\n    id\n    name\n    status\n  }\n': typeof types.SpotDetailHeader_SpotFragmentDoc;
  '\n  fragment SpotDetailHeader_PrimaryDef on SpotAvailabilityDefinition {\n    timezone\n    startDate\n    frequency\n    interval\n    byWeekday\n    byMonthday\n    endsCount\n    endsAt\n  }\n': typeof types.SpotDetailHeader_PrimaryDefFragmentDoc;
  '\n  fragment SpotMeta_Spot on SpotDefinition {\n    id\n    status\n    city {\n      ...City_Basic\n    }\n  }\n': typeof types.SpotMeta_SpotFragmentDoc;
  '\n  fragment SpotLocation_Spot on SpotDefinition {\n    id\n    name\n    latitude\n    longitude\n  }\n': typeof types.SpotLocation_SpotFragmentDoc;
  '\n  fragment SpotOccurrenceItem on SpotAvailability {\n    id\n    date\n    status\n  }\n': typeof types.SpotOccurrenceItemFragmentDoc;
  '\n  query SpotDetail_Definition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      id\n      name\n      description\n      status\n      latitude\n      longitude\n      city {\n        id\n        name\n      }\n      spotAvailabilityDefinition {\n        id\n        timezone\n        startDate\n        frequency\n        interval\n        byWeekday\n        byMonthday\n        endsCount\n        endsAt\n        isActive\n        maxCapacity\n      }\n    }\n  }\n': typeof types.SpotDetail_DefinitionDocument;
  '\n  query SpotDetail_Occurrences(\n    $availabilityDefinitionId: ID!\n    $start: Date!\n    $end: Date!\n  ) {\n    occurrencesByAvailabilityDefinition(\n      input: {\n        availabilityDefinitionId: $availabilityDefinitionId\n        start: $start\n        end: $end\n      }\n    ) {\n      id\n      date\n      status\n    }\n  }\n': typeof types.SpotDetail_OccurrencesDocument;
  '\n  mutation SpotDetail_SetPublish($id: ID!, $publish: Boolean!) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n': typeof types.SpotDetail_SetPublishDocument;
  '\n  query EditSpot_SpotDefinition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      ...SellerSpot_Detail\n    }\n  }\n': typeof types.EditSpot_SpotDefinitionDocument;
  '\n  query EditSpot_AvailabilityDef($spotDefinitionId: ID!) {\n    availabilityDefinitionBySpotDefinition(\n      input: { spotDefinitionId: $spotDefinitionId }\n    ) {\n      id\n      timezone\n      startDate\n      frequency\n      interval\n      byWeekday\n      byMonthday\n      endsCount\n      endsAt\n      isActive\n      feeReference\n      maxCapacity\n    }\n  }\n': typeof types.EditSpot_AvailabilityDefDocument;
  '\n  mutation EditSpot_UpsertAvailabilityDefinition(\n    $input: UpsertAvailabilityDefinitionInput!\n  ) {\n    upsertAvailabilityDefinition(input: $input) {\n      id\n    }\n  }\n': typeof types.EditSpot_UpsertAvailabilityDefinitionDocument;
  '\n  query page_AvailabilityHeatmap(\n    $bbox: BBoxInput!\n    $date: String!\n    $resolution: Int!\n  ) {\n    availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {\n      id\n      count\n      geometry\n      h3Index\n    }\n  }\n': typeof types.Page_AvailabilityHeatmapDocument;
  '\n  query page_BookingsHeatmap(\n    $bbox: BBoxInput!\n    $dateRange: DateRangeInput!\n    $resolution: Int!\n  ) {\n    bookingsHeatmap(\n      bbox: $bbox\n      dateRange: $dateRange\n      resolution: $resolution\n    ) {\n      id\n      count\n      geometry\n      h3Index\n    }\n  }\n': typeof types.Page_BookingsHeatmapDocument;
  '\n  query page_CollectivityNewSpot_Cities($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      ...City_Basic\n    }\n  }\n': typeof types.Page_CollectivityNewSpot_CitiesDocument;
  '\n  query NewSpot_Conflicts($cityId: ID, $date: Date!) {\n    availabilitiesByCityDate(input: { cityId: $cityId, date: $date }) {\n      id\n      spotDefinition {\n        id\n        name\n      }\n    }\n  }\n': typeof types.NewSpot_ConflictsDocument;
  '\n  mutation NewSpot_UpsertSpotDefinition($input: UpsertSpotDefinitionInput!) {\n    upsertSpotDefinition(input: $input) {\n      id\n      name\n      city {\n        id\n      }\n    }\n  }\n': typeof types.NewSpot_UpsertSpotDefinitionDocument;
  '\n  mutation NewSpot_UpsertAvailabilityDefinition(\n    $input: UpsertAvailabilityDefinitionInput!\n  ) {\n    upsertAvailabilityDefinition(input: $input) {\n      id\n    }\n  }\n': typeof types.NewSpot_UpsertAvailabilityDefinitionDocument;
  '\n  mutation NewSpot_CreateSpotWithAvailability(\n    $input: CreateSpotWithAvailabilityInput!\n  ) {\n    createSpotWithAvailability(input: $input) {\n      id\n    }\n  }\n': typeof types.NewSpot_CreateSpotWithAvailabilityDocument;
  '\n  query AvailabilityHeatmap(\n    $bbox: BBoxInput!\n    $date: String!\n    $resolution: Int!\n  ) {\n    availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {\n      id\n      h3Index\n      count\n      geometry\n    }\n  }\n': typeof types.AvailabilityHeatmapDocument;
  '\n  query BookingsHeatmap(\n    $bbox: BBoxInput!\n    $dateRange: DateRangeInput!\n    $resolution: Int!\n  ) {\n    bookingsHeatmap(\n      bbox: $bbox\n      dateRange: $dateRange\n      resolution: $resolution\n    ) {\n      id\n      h3Index\n      count\n      geometry\n    }\n  }\n': typeof types.BookingsHeatmapDocument;
  '\n  query WholesaleProducts($category: String, $activeOnly: Boolean) {\n    wholesaleProducts(category: $category, activeOnly: $activeOnly) {\n      id\n      name\n      sku\n      description\n      packSize\n      unitPrice\n      stockQuantity\n      category\n      subcategory\n      isActive\n    }\n  }\n': typeof types.WholesaleProductsDocument;
  '\n  query MyWholesaleOrders {\n    myWholesaleOrders {\n      id\n      sellerId\n      totalAmount\n      currency\n      status\n      createdAt\n      updatedAt\n      items {\n        id\n        productId\n        quantity\n        unitPrice\n        totalPrice\n      }\n    }\n  }\n': typeof types.MyWholesaleOrdersDocument;
  '\n  query Cities($input: SearchCitiesInput!) {\n    cities(input: $input) {\n      id\n      name\n      code\n      countryId\n    }\n  }\n': typeof types.CitiesDocument;
  '\n  query AvailabilitiesByCityDate($date: Date!, $cityId: ID, $limit: Int) {\n    availabilitiesByCityDate(\n      input: { date: $date, cityId: $cityId, limit: $limit }\n    ) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          latitude\n          longitude\n          city {\n            id\n            name\n          }\n          status\n        }\n      }\n    }\n  }\n': typeof types.AvailabilitiesByCityDateDocument;
  '\n  query Hooks_MyActiveOrg {\n    myActiveOrganization {\n      id\n      name\n      slug\n      type\n    }\n  }\n': typeof types.Hooks_MyActiveOrgDocument;
};
const documents: Documents = {
  '\n  query page_CollectivityDashboardMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n':
    types.Page_CollectivityDashboardMetricsQueryDocument,
  '\n  query page_CollectivityMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n':
    types.Page_CollectivityMetricsQueryDocument,
  '\n  query page_CollectivityOverview_Cities($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n':
    types.Page_CollectivityOverview_CitiesDocument,
  '\n  fragment CityOverview on City {\n    id\n    name\n  }\n':
    types.CityOverviewFragmentDoc,
  '\n  query page_CollectivityOverview_Availabilities($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      ...SpotAvailability_ListItem\n    }\n  }\n':
    types.Page_CollectivityOverview_AvailabilitiesDocument,
  '\n  query CollectivityPrivacy_MyGdprRequestsQuery {\n    myGdprRequests {\n      id\n      type\n      status\n      createdAt\n      metadata\n    }\n  }\n':
    types.CollectivityPrivacy_MyGdprRequestsQueryDocument,
  '\n  mutation CollectivityPrivacy_RequestDataExportMutation {\n    requestDataExport {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n':
    types.CollectivityPrivacy_RequestDataExportMutationDocument,
  '\n  mutation CollectivityPrivacy_RequestAccountDeletionMutation(\n    $input: RequestAccountDeletionInput!\n  ) {\n    requestAccountDeletion(input: $input) {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n':
    types.CollectivityPrivacy_RequestAccountDeletionMutationDocument,
  '\n  query page_CollectivitySpotDefinition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      id\n      name\n      status\n      description\n      city {\n        id\n        name\n      }\n    }\n  }\n':
    types.Page_CollectivitySpotDefinitionDocument,
  '\n  query page_CollectivityCitiesQuery($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n':
    types.Page_CollectivityCitiesQueryDocument,
  '\n  query page_CollectivitySpots_Availabilities($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      ...SpotAvailability_ListItem\n    }\n  }\n':
    types.Page_CollectivitySpots_AvailabilitiesDocument,
  '\n  query page_CollectivitySpotDefinitions($q: String, $cityId: ID, $limit: Int) {\n    spotDefinitions(input: { q: $q, cityId: $cityId, limit: $limit }) {\n      ...SpotDefinition_Basic\n      spotAvailabilityDefinition {\n        id\n        timezone\n        startDate\n        frequency\n        interval\n        byWeekday\n        byMonthday\n        endsCount\n        endsAt\n        isActive\n        feeReference\n        maxCapacity\n      }\n    }\n  }\n':
    types.Page_CollectivitySpotDefinitionsDocument,
  '\n  mutation page_CollectivitySetSpotDefinitionPublish(\n    $id: ID!\n    $publish: Boolean!\n  ) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n':
    types.Page_CollectivitySetSpotDefinitionPublishDocument,
  '\n  query page_PlatformAdminBookingsQuery($first: Int, $after: String) {\n    adminBookings(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          status\n          bookedAt\n          spotAvailability {\n            date\n          }\n          spotDefinition {\n            name\n            latitude\n            longitude\n            city {\n              name\n            }\n          }\n          seller {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n':
    types.Page_PlatformAdminBookingsQueryDocument,
  '\n  query Page_AdminCollectivityDetails($id: ID!) {\n    adminCollectivity(input: { id: $id }) {\n      id\n      name\n      siret\n    }\n  }\n':
    types.Page_AdminCollectivityDetailsDocument,
  '\n  mutation Page_AdminInvite($input: AdminInviteInput!) {\n    adminInviteToCollectivity(input: $input)\n  }\n':
    types.Page_AdminInviteDocument,
  '\n  mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {\n    adminAppendCollectivityNote(input: $input)\n  }\n':
    types.Page_AdminAppendNoteDocument,
  '\n    query Page_AdminCollectivities {\n      adminCollectivities {\n        id\n        name\n        siret\n      }\n    }\n  ':
    types.Page_AdminCollectivitiesDocument,
  '\n    mutation Page_AdminInvite($input: AdminInviteInput!) {\n      adminInviteToCollectivity(input: $input)\n    }\n  ':
    types.Page_AdminInviteDocument,
  '\n    mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {\n      adminAppendCollectivityNote(input: $input)\n    }\n  ':
    types.Page_AdminAppendNoteDocument,
  '\n    mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {\n      adminCreateOrganization(input: $input) {\n        id\n      }\n    }\n  ':
    types.Page_AdminCreateOrgDocument,
  '\n  query AdminContentListQuery {\n    adminContentList {\n      id\n      isPublished\n      locales {\n        locale\n        slug\n        title\n        summary\n      }\n    }\n  }\n':
    types.AdminContentListQueryDocument,
  '\n  mutation AdminUpsertContentMutation($input: AdminUpsertContentInput!) {\n    adminUpsertContent(input: $input) {\n      id\n    }\n  }\n':
    types.AdminUpsertContentMutationDocument,
  '\n  mutation AdminTranslateContentMutation($input: AdminTranslateContentInput!) {\n    adminTranslateContent(input: $input) {\n      id\n    }\n  }\n':
    types.AdminTranslateContentMutationDocument,
  '\n  query page_PlatformAdminDashboardMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n':
    types.Page_PlatformAdminDashboardMetricsQueryDocument,
  '\n  query page_PlatformAdminUsersQuery($page: Int, $limit: Int) {\n    adminUsersWithCompliance(page: $page, limit: $limit) {\n      items {\n        id\n        firstName\n        lastName\n        email\n        uploadedDocCount\n        lastUploadAt\n        complianceBadge\n      }\n      totalItems\n      totalPages\n    }\n  }\n':
    types.Page_PlatformAdminUsersQueryDocument,
  '\n  query page_PlatformAdminMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n':
    types.Page_PlatformAdminMetricsQueryDocument,
  '\n  query page_PlatformAdminOrdersQuery($first: Int, $after: String) {\n    adminWholesaleOrders(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          createdAt\n          totalAmount\n          currency\n          status\n          sellerId\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n':
    types.Page_PlatformAdminOrdersQueryDocument,
  '\n  query Page_AdminSellers {\n    adminSellers {\n      id\n      name\n      siret\n      createdAt\n      complianceBadge\n    }\n  }\n':
    types.Page_AdminSellersDocument,
  '\n    query Page_AdminSellers {\n      adminSellers {\n        id\n        name\n        siret\n        createdAt\n        complianceBadge\n      }\n    }\n  ':
    types.Page_AdminSellersDocument,
  '\n        mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {\n          adminCreateOrganization(input: $input) {\n            id\n          }\n        }\n      ':
    types.Page_AdminCreateOrgDocument,
  '\n  query page_Admin_CitiesQuery($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n':
    types.Page_Admin_CitiesQueryDocument,
  '\n  query page_Admin_AvailabilitiesByCityDateQuery($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          city {\n            id\n            name\n          }\n          latitude\n          longitude\n          status\n        }\n      }\n    }\n  }\n':
    types.Page_Admin_AvailabilitiesByCityDateQueryDocument,
  '\n  mutation page_AdminSetSpotDefinitionPublish($id: ID!, $publish: Boolean!) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n':
    types.Page_AdminSetSpotDefinitionPublishDocument,
  '\n  query AdminUserDetails($userId: ID!) {\n    adminUserDetails(userId: $userId) {\n      id\n      email\n      name\n      phoneNumber\n      createdAt\n      updatedAt\n      lastLoginAt\n      status\n      emailVerified\n      phoneVerified\n      profile {\n        firstName\n        lastName\n        dateOfBirth\n        address {\n          street\n          city\n          postalCode\n          country\n        }\n        profession\n        companyName\n        siret\n      }\n      kyc {\n        status\n        level\n        verifiedAt\n        reviewedBy\n        reviewNotes\n        documents {\n          id\n          documentType\n          status\n          fileName\n          updatedAt\n        }\n        riskScore\n        lastReviewAt\n      }\n      metrics {\n        totalLogins\n        lastActivityAt\n        documentsUploaded\n        organizationsCount\n        subscriptionStatus\n        lifetimeValue\n      }\n      organizations {\n        id\n        name\n        role\n        joinedAt\n      }\n    }\n  }\n':
    types.AdminUserDetailsDocument,
  '\n  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {\n    updateUserProfile(userId: $userId, input: $input) {\n      id\n      name\n      email\n      phoneNumber\n      status\n    }\n  }\n':
    types.UpdateUserProfileDocument,
  '\n  mutation ReviewKYC($userId: ID!, $input: ReviewKYCInput!) {\n    reviewKYC(userId: $userId, input: $input) {\n      id\n      status\n      level\n      reviewNotes\n      verifiedAt\n    }\n  }\n':
    types.ReviewKycDocument,
  '\n  mutation ReviewDocument($input: ReviewDocumentInput!) {\n    reviewDocument(input: $input) {\n      id\n      status\n      verifiedAt\n      reviewNotes\n    }\n  }\n':
    types.ReviewDocumentDocument,
  '\n  mutation Page_AdminCreateUser($input: AdminCreateUserInput!) {\n    adminCreateUser(input: $input)\n  }\n':
    types.Page_AdminCreateUserDocument,
  '\n  query Page_AdminCollectivities {\n    adminCollectivities {\n      id\n      name\n      siret\n    }\n  }\n':
    types.Page_AdminCollectivitiesDocument,
  '\n  query page_PlatformAdminWaitingListQuery {\n    adminWaitingList {\n      items {\n        id\n        email\n        createdAt\n        firstName\n        lastName\n      }\n    }\n  }\n':
    types.Page_PlatformAdminWaitingListQueryDocument,
  '\n  mutation AdminAllowWaitlist($input: AdminAllowWaitlistInput!) {\n    adminAllowWaitlistEntry(input: $input)\n  }\n':
    types.AdminAllowWaitlistDocument,
  '\n      query Dashboard_SellerComplianceQuery {\n        sellerCompliance {\n          sellerId\n          badge\n          missingCore\n          expiring\n          uploadedCount\n          hasVerifiedKBIS\n          hasVerifiedUser\n        }\n      }\n    ':
    types.Dashboard_SellerComplianceQueryDocument,
  '\n  query page_SellerDocsQuery {\n    myDocuments {\n      id\n      documentType\n      status\n      expiryDate\n    }\n  }\n':
    types.Page_SellerDocsQueryDocument,
  '\n  mutation page_UploadDocMutation($input: UploadDocumentInput!) {\n    uploadDocument(input: $input) {\n      id\n      status\n    }\n  }\n':
    types.Page_UploadDocMutationDocument,
  '\n      query Profile_UserKycStatusQuery {\n        userKycStatus {\n          phoneVerified\n          hasVerifiedIdDocument\n          isVerified\n        }\n      }\n    ':
    types.Profile_UserKycStatusQueryDocument,
  '\n  query SellerPrivacy_MyGdprRequestsQuery {\n    myGdprRequests {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n':
    types.SellerPrivacy_MyGdprRequestsQueryDocument,
  '\n  mutation SellerPrivacy_RequestDataExportMutation {\n    requestDataExport {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n':
    types.SellerPrivacy_RequestDataExportMutationDocument,
  '\n  mutation SellerPrivacy_RequestAccountDeletionMutation(\n    $input: RequestAccountDeletionInput!\n  ) {\n    requestAccountDeletion(input: $input) {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n':
    types.SellerPrivacy_RequestAccountDeletionMutationDocument,
  '\n  fragment SellerSpot_Detail on SpotDefinition {\n    id\n    name\n    description\n    status\n    city {\n      id\n      ...City_Basic\n    }\n  }\n':
    types.SellerSpot_DetailFragmentDoc,
  '\n  query page_SellerSpotDetail($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      ...SellerSpot_Detail\n    }\n  }\n':
    types.Page_SellerSpotDetailDocument,
  '\n  mutation page_SellerBookSpot($availabilityId: ID!) {\n    bookAvailability(input: { availabilityId: $availabilityId }) {\n      id\n      status\n      bookedAt\n    }\n  }\n':
    types.Page_SellerBookSpotDocument,
  '\n  query page_SellerAvailabilitiesQuery($date: Date!, $q: String) {\n    availabilitiesByCityDate(input: { date: $date }) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          latitude\n          longitude\n          city {\n            name\n          }\n        }\n      }\n    }\n  }\n':
    types.Page_SellerAvailabilitiesQueryDocument,
  '\n  mutation page_SellerAvailabilities_Book($availabilityId: ID!) {\n    bookAvailability(input: { availabilityId: $availabilityId }) {\n      id\n      status\n    }\n  }\n':
    types.Page_SellerAvailabilities_BookDocument,
  '\n  mutation page_WholesaleCheckoutMutation($input: WholesaleCheckoutInput!) {\n    wholesaleCheckout(input: $input) {\n      id\n      status\n      totalAmount\n      currency\n    }\n  }\n':
    types.Page_WholesaleCheckoutMutationDocument,
  '\n  fragment Country_Basic on PublicCountry {\n    id\n    name\n    code\n  }\n':
    types.Country_BasicFragmentDoc,
  '\n  fragment City_Basic on City {\n    id\n    name\n    code\n  }\n':
    types.City_BasicFragmentDoc,
  '\n  fragment Address_Basic on PublicAddress {\n    id\n    addressLine1\n    addressLine2\n    postalCode\n  }\n':
    types.Address_BasicFragmentDoc,
  '\n  fragment SpotDefinition_Basic on SpotDefinition {\n    id\n    name\n    description\n    status\n    latitude\n    longitude\n    updatedAt\n    city {\n      ...City_Basic\n    }\n  }\n':
    types.SpotDefinition_BasicFragmentDoc,
  '\n  fragment SpotAvailability_ListItem on SpotAvailability {\n    id\n    date\n    status\n    spotDefinition {\n      id\n      ...SpotDefinition_Basic\n    }\n  }\n':
    types.SpotAvailability_ListItemFragmentDoc,
  '\n  fragment Booking_ListItem on Booking {\n    id\n    status\n    bookedAt\n    complianceBadgeAtBooking\n  }\n':
    types.Booking_ListItemFragmentDoc,
  '\n  query page_StritMeForOnboardingManager {\n    me {\n      id\n      onboardingCompleted\n      onboardingStep\n      metadata\n    }\n    myOrganizations {\n      id\n      name\n      type\n      onboardingCompleted\n      onboardingStep\n    }\n  }\n':
    types.Page_StritMeForOnboardingManagerDocument,
  '\n          mutation Auth_Unlink($providerId: String!) {\n            unlinkProvider(providerId: $providerId)\n          }\n        ':
    types.Auth_UnlinkDocument,
  '\n      query Auth_ConnectionStatus {\n        connectionStatus {\n          linkedProviders\n        }\n      }\n    ':
    types.Auth_ConnectionStatusDocument,
  '\n  query page_SellerBookingsQuery {\n    myBookings {\n      id\n      status\n      bookedAt\n      spotAvailability {\n        date\n        spotAvailabilityDefinition {\n          feeReference\n          maxCapacity\n        }\n      }\n      spotDefinition {\n        name\n        latitude\n        longitude\n        city {\n          name\n        }\n      }\n    }\n  }\n':
    types.Page_SellerBookingsQueryDocument,
  '\n  mutation page_SellerBookings_Cancel($id: ID!) {\n    cancelBooking(input: { id: $id }) {\n      id\n      status\n      cancelledAt\n    }\n  }\n':
    types.Page_SellerBookings_CancelDocument,
  '\n  fragment SpotDetailHeader_Spot on SpotDefinition {\n    id\n    name\n    status\n  }\n':
    types.SpotDetailHeader_SpotFragmentDoc,
  '\n  fragment SpotDetailHeader_PrimaryDef on SpotAvailabilityDefinition {\n    timezone\n    startDate\n    frequency\n    interval\n    byWeekday\n    byMonthday\n    endsCount\n    endsAt\n  }\n':
    types.SpotDetailHeader_PrimaryDefFragmentDoc,
  '\n  fragment SpotMeta_Spot on SpotDefinition {\n    id\n    status\n    city {\n      ...City_Basic\n    }\n  }\n':
    types.SpotMeta_SpotFragmentDoc,
  '\n  fragment SpotLocation_Spot on SpotDefinition {\n    id\n    name\n    latitude\n    longitude\n  }\n':
    types.SpotLocation_SpotFragmentDoc,
  '\n  fragment SpotOccurrenceItem on SpotAvailability {\n    id\n    date\n    status\n  }\n':
    types.SpotOccurrenceItemFragmentDoc,
  '\n  query SpotDetail_Definition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      id\n      name\n      description\n      status\n      latitude\n      longitude\n      city {\n        id\n        name\n      }\n      spotAvailabilityDefinition {\n        id\n        timezone\n        startDate\n        frequency\n        interval\n        byWeekday\n        byMonthday\n        endsCount\n        endsAt\n        isActive\n        maxCapacity\n      }\n    }\n  }\n':
    types.SpotDetail_DefinitionDocument,
  '\n  query SpotDetail_Occurrences(\n    $availabilityDefinitionId: ID!\n    $start: Date!\n    $end: Date!\n  ) {\n    occurrencesByAvailabilityDefinition(\n      input: {\n        availabilityDefinitionId: $availabilityDefinitionId\n        start: $start\n        end: $end\n      }\n    ) {\n      id\n      date\n      status\n    }\n  }\n':
    types.SpotDetail_OccurrencesDocument,
  '\n  mutation SpotDetail_SetPublish($id: ID!, $publish: Boolean!) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n':
    types.SpotDetail_SetPublishDocument,
  '\n  query EditSpot_SpotDefinition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      ...SellerSpot_Detail\n    }\n  }\n':
    types.EditSpot_SpotDefinitionDocument,
  '\n  query EditSpot_AvailabilityDef($spotDefinitionId: ID!) {\n    availabilityDefinitionBySpotDefinition(\n      input: { spotDefinitionId: $spotDefinitionId }\n    ) {\n      id\n      timezone\n      startDate\n      frequency\n      interval\n      byWeekday\n      byMonthday\n      endsCount\n      endsAt\n      isActive\n      feeReference\n      maxCapacity\n    }\n  }\n':
    types.EditSpot_AvailabilityDefDocument,
  '\n  mutation EditSpot_UpsertAvailabilityDefinition(\n    $input: UpsertAvailabilityDefinitionInput!\n  ) {\n    upsertAvailabilityDefinition(input: $input) {\n      id\n    }\n  }\n':
    types.EditSpot_UpsertAvailabilityDefinitionDocument,
  '\n  query page_AvailabilityHeatmap(\n    $bbox: BBoxInput!\n    $date: String!\n    $resolution: Int!\n  ) {\n    availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {\n      id\n      count\n      geometry\n      h3Index\n    }\n  }\n':
    types.Page_AvailabilityHeatmapDocument,
  '\n  query page_BookingsHeatmap(\n    $bbox: BBoxInput!\n    $dateRange: DateRangeInput!\n    $resolution: Int!\n  ) {\n    bookingsHeatmap(\n      bbox: $bbox\n      dateRange: $dateRange\n      resolution: $resolution\n    ) {\n      id\n      count\n      geometry\n      h3Index\n    }\n  }\n':
    types.Page_BookingsHeatmapDocument,
  '\n  query page_CollectivityNewSpot_Cities($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      ...City_Basic\n    }\n  }\n':
    types.Page_CollectivityNewSpot_CitiesDocument,
  '\n  query NewSpot_Conflicts($cityId: ID, $date: Date!) {\n    availabilitiesByCityDate(input: { cityId: $cityId, date: $date }) {\n      id\n      spotDefinition {\n        id\n        name\n      }\n    }\n  }\n':
    types.NewSpot_ConflictsDocument,
  '\n  mutation NewSpot_UpsertSpotDefinition($input: UpsertSpotDefinitionInput!) {\n    upsertSpotDefinition(input: $input) {\n      id\n      name\n      city {\n        id\n      }\n    }\n  }\n':
    types.NewSpot_UpsertSpotDefinitionDocument,
  '\n  mutation NewSpot_UpsertAvailabilityDefinition(\n    $input: UpsertAvailabilityDefinitionInput!\n  ) {\n    upsertAvailabilityDefinition(input: $input) {\n      id\n    }\n  }\n':
    types.NewSpot_UpsertAvailabilityDefinitionDocument,
  '\n  mutation NewSpot_CreateSpotWithAvailability(\n    $input: CreateSpotWithAvailabilityInput!\n  ) {\n    createSpotWithAvailability(input: $input) {\n      id\n    }\n  }\n':
    types.NewSpot_CreateSpotWithAvailabilityDocument,
  '\n  query AvailabilityHeatmap(\n    $bbox: BBoxInput!\n    $date: String!\n    $resolution: Int!\n  ) {\n    availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {\n      id\n      h3Index\n      count\n      geometry\n    }\n  }\n':
    types.AvailabilityHeatmapDocument,
  '\n  query BookingsHeatmap(\n    $bbox: BBoxInput!\n    $dateRange: DateRangeInput!\n    $resolution: Int!\n  ) {\n    bookingsHeatmap(\n      bbox: $bbox\n      dateRange: $dateRange\n      resolution: $resolution\n    ) {\n      id\n      h3Index\n      count\n      geometry\n    }\n  }\n':
    types.BookingsHeatmapDocument,
  '\n  query WholesaleProducts($category: String, $activeOnly: Boolean) {\n    wholesaleProducts(category: $category, activeOnly: $activeOnly) {\n      id\n      name\n      sku\n      description\n      packSize\n      unitPrice\n      stockQuantity\n      category\n      subcategory\n      isActive\n    }\n  }\n':
    types.WholesaleProductsDocument,
  '\n  query MyWholesaleOrders {\n    myWholesaleOrders {\n      id\n      sellerId\n      totalAmount\n      currency\n      status\n      createdAt\n      updatedAt\n      items {\n        id\n        productId\n        quantity\n        unitPrice\n        totalPrice\n      }\n    }\n  }\n':
    types.MyWholesaleOrdersDocument,
  '\n  query Cities($input: SearchCitiesInput!) {\n    cities(input: $input) {\n      id\n      name\n      code\n      countryId\n    }\n  }\n':
    types.CitiesDocument,
  '\n  query AvailabilitiesByCityDate($date: Date!, $cityId: ID, $limit: Int) {\n    availabilitiesByCityDate(\n      input: { date: $date, cityId: $cityId, limit: $limit }\n    ) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          latitude\n          longitude\n          city {\n            id\n            name\n          }\n          status\n        }\n      }\n    }\n  }\n':
    types.AvailabilitiesByCityDateDocument,
  '\n  query Hooks_MyActiveOrg {\n    myActiveOrganization {\n      id\n      name\n      slug\n      type\n    }\n  }\n':
    types.Hooks_MyActiveOrgDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivityDashboardMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivityDashboardMetricsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivityMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivityMetricsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivityOverview_Cities($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivityOverview_CitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment CityOverview on City {\n    id\n    name\n  }\n'
): typeof import('./graphql').CityOverviewFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivityOverview_Availabilities($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      ...SpotAvailability_ListItem\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivityOverview_AvailabilitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CollectivityPrivacy_MyGdprRequestsQuery {\n    myGdprRequests {\n      id\n      type\n      status\n      createdAt\n      metadata\n    }\n  }\n'
): typeof import('./graphql').CollectivityPrivacy_MyGdprRequestsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CollectivityPrivacy_RequestDataExportMutation {\n    requestDataExport {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').CollectivityPrivacy_RequestDataExportMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CollectivityPrivacy_RequestAccountDeletionMutation(\n    $input: RequestAccountDeletionInput!\n  ) {\n    requestAccountDeletion(input: $input) {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').CollectivityPrivacy_RequestAccountDeletionMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivitySpotDefinition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      id\n      name\n      status\n      description\n      city {\n        id\n        name\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivitySpotDefinitionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivityCitiesQuery($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivityCitiesQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivitySpots_Availabilities($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      ...SpotAvailability_ListItem\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivitySpots_AvailabilitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivitySpotDefinitions($q: String, $cityId: ID, $limit: Int) {\n    spotDefinitions(input: { q: $q, cityId: $cityId, limit: $limit }) {\n      ...SpotDefinition_Basic\n      spotAvailabilityDefinition {\n        id\n        timezone\n        startDate\n        frequency\n        interval\n        byWeekday\n        byMonthday\n        endsCount\n        endsAt\n        isActive\n        feeReference\n        maxCapacity\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivitySpotDefinitionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_CollectivitySetSpotDefinitionPublish(\n    $id: ID!\n    $publish: Boolean!\n  ) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivitySetSpotDefinitionPublishDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_PlatformAdminBookingsQuery($first: Int, $after: String) {\n    adminBookings(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          status\n          bookedAt\n          spotAvailability {\n            date\n          }\n          spotDefinition {\n            name\n            latitude\n            longitude\n            city {\n              name\n            }\n          }\n          seller {\n            name\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_PlatformAdminBookingsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Page_AdminCollectivityDetails($id: ID!) {\n    adminCollectivity(input: { id: $id }) {\n      id\n      name\n      siret\n    }\n  }\n'
): typeof import('./graphql').Page_AdminCollectivityDetailsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Page_AdminInvite($input: AdminInviteInput!) {\n    adminInviteToCollectivity(input: $input)\n  }\n'
): typeof import('./graphql').Page_AdminInviteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {\n    adminAppendCollectivityNote(input: $input)\n  }\n'
): typeof import('./graphql').Page_AdminAppendNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query Page_AdminCollectivities {\n      adminCollectivities {\n        id\n        name\n        siret\n      }\n    }\n  '
): typeof import('./graphql').Page_AdminCollectivitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation Page_AdminInvite($input: AdminInviteInput!) {\n      adminInviteToCollectivity(input: $input)\n    }\n  '
): typeof import('./graphql').Page_AdminInviteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation Page_AdminAppendNote($input: AdminAppendCollectivityNoteInput!) {\n      adminAppendCollectivityNote(input: $input)\n    }\n  '
): typeof import('./graphql').Page_AdminAppendNoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {\n      adminCreateOrganization(input: $input) {\n        id\n      }\n    }\n  '
): typeof import('./graphql').Page_AdminCreateOrgDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AdminContentListQuery {\n    adminContentList {\n      id\n      isPublished\n      locales {\n        locale\n        slug\n        title\n        summary\n      }\n    }\n  }\n'
): typeof import('./graphql').AdminContentListQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AdminUpsertContentMutation($input: AdminUpsertContentInput!) {\n    adminUpsertContent(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').AdminUpsertContentMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AdminTranslateContentMutation($input: AdminTranslateContentInput!) {\n    adminTranslateContent(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').AdminTranslateContentMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_PlatformAdminDashboardMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n'
): typeof import('./graphql').Page_PlatformAdminDashboardMetricsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_PlatformAdminUsersQuery($page: Int, $limit: Int) {\n    adminUsersWithCompliance(page: $page, limit: $limit) {\n      items {\n        id\n        firstName\n        lastName\n        email\n        uploadedDocCount\n        lastUploadAt\n        complianceBadge\n      }\n      totalItems\n      totalPages\n    }\n  }\n'
): typeof import('./graphql').Page_PlatformAdminUsersQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_PlatformAdminMetricsQuery {\n    collectivityMetricsSnapshot {\n      label\n      value\n    }\n  }\n'
): typeof import('./graphql').Page_PlatformAdminMetricsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_PlatformAdminOrdersQuery($first: Int, $after: String) {\n    adminWholesaleOrders(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          createdAt\n          totalAmount\n          currency\n          status\n          sellerId\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_PlatformAdminOrdersQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Page_AdminSellers {\n    adminSellers {\n      id\n      name\n      siret\n      createdAt\n      complianceBadge\n    }\n  }\n'
): typeof import('./graphql').Page_AdminSellersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    query Page_AdminSellers {\n      adminSellers {\n        id\n        name\n        siret\n        createdAt\n        complianceBadge\n      }\n    }\n  '
): typeof import('./graphql').Page_AdminSellersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        mutation Page_AdminCreateOrg($input: AdminCreateOrganizationInput!) {\n          adminCreateOrganization(input: $input) {\n            id\n          }\n        }\n      '
): typeof import('./graphql').Page_AdminCreateOrgDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_Admin_CitiesQuery($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      id\n      name\n      code\n    }\n  }\n'
): typeof import('./graphql').Page_Admin_CitiesQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_Admin_AvailabilitiesByCityDateQuery($date: Date!, $cityId: ID) {\n    availabilitiesByCityDate(input: { date: $date, cityId: $cityId }) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          city {\n            id\n            name\n          }\n          latitude\n          longitude\n          status\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_Admin_AvailabilitiesByCityDateQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_AdminSetSpotDefinitionPublish($id: ID!, $publish: Boolean!) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').Page_AdminSetSpotDefinitionPublishDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AdminUserDetails($userId: ID!) {\n    adminUserDetails(userId: $userId) {\n      id\n      email\n      name\n      phoneNumber\n      createdAt\n      updatedAt\n      lastLoginAt\n      status\n      emailVerified\n      phoneVerified\n      profile {\n        firstName\n        lastName\n        dateOfBirth\n        address {\n          street\n          city\n          postalCode\n          country\n        }\n        profession\n        companyName\n        siret\n      }\n      kyc {\n        status\n        level\n        verifiedAt\n        reviewedBy\n        reviewNotes\n        documents {\n          id\n          documentType\n          status\n          fileName\n          updatedAt\n        }\n        riskScore\n        lastReviewAt\n      }\n      metrics {\n        totalLogins\n        lastActivityAt\n        documentsUploaded\n        organizationsCount\n        subscriptionStatus\n        lifetimeValue\n      }\n      organizations {\n        id\n        name\n        role\n        joinedAt\n      }\n    }\n  }\n'
): typeof import('./graphql').AdminUserDetailsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateUserProfile($userId: ID!, $input: UpdateUserProfileInput!) {\n    updateUserProfile(userId: $userId, input: $input) {\n      id\n      name\n      email\n      phoneNumber\n      status\n    }\n  }\n'
): typeof import('./graphql').UpdateUserProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ReviewKYC($userId: ID!, $input: ReviewKYCInput!) {\n    reviewKYC(userId: $userId, input: $input) {\n      id\n      status\n      level\n      reviewNotes\n      verifiedAt\n    }\n  }\n'
): typeof import('./graphql').ReviewKycDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ReviewDocument($input: ReviewDocumentInput!) {\n    reviewDocument(input: $input) {\n      id\n      status\n      verifiedAt\n      reviewNotes\n    }\n  }\n'
): typeof import('./graphql').ReviewDocumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Page_AdminCreateUser($input: AdminCreateUserInput!) {\n    adminCreateUser(input: $input)\n  }\n'
): typeof import('./graphql').Page_AdminCreateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Page_AdminCollectivities {\n    adminCollectivities {\n      id\n      name\n      siret\n    }\n  }\n'
): typeof import('./graphql').Page_AdminCollectivitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_PlatformAdminWaitingListQuery {\n    adminWaitingList {\n      items {\n        id\n        email\n        createdAt\n        firstName\n        lastName\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_PlatformAdminWaitingListQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AdminAllowWaitlist($input: AdminAllowWaitlistInput!) {\n    adminAllowWaitlistEntry(input: $input)\n  }\n'
): typeof import('./graphql').AdminAllowWaitlistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query Dashboard_SellerComplianceQuery {\n        sellerCompliance {\n          sellerId\n          badge\n          missingCore\n          expiring\n          uploadedCount\n          hasVerifiedKBIS\n          hasVerifiedUser\n        }\n      }\n    '
): typeof import('./graphql').Dashboard_SellerComplianceQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_SellerDocsQuery {\n    myDocuments {\n      id\n      documentType\n      status\n      expiryDate\n    }\n  }\n'
): typeof import('./graphql').Page_SellerDocsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_UploadDocMutation($input: UploadDocumentInput!) {\n    uploadDocument(input: $input) {\n      id\n      status\n    }\n  }\n'
): typeof import('./graphql').Page_UploadDocMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query Profile_UserKycStatusQuery {\n        userKycStatus {\n          phoneVerified\n          hasVerifiedIdDocument\n          isVerified\n        }\n      }\n    '
): typeof import('./graphql').Profile_UserKycStatusQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SellerPrivacy_MyGdprRequestsQuery {\n    myGdprRequests {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').SellerPrivacy_MyGdprRequestsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SellerPrivacy_RequestDataExportMutation {\n    requestDataExport {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').SellerPrivacy_RequestDataExportMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SellerPrivacy_RequestAccountDeletionMutation(\n    $input: RequestAccountDeletionInput!\n  ) {\n    requestAccountDeletion(input: $input) {\n      id\n      type\n      status\n      createdAt\n    }\n  }\n'
): typeof import('./graphql').SellerPrivacy_RequestAccountDeletionMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SellerSpot_Detail on SpotDefinition {\n    id\n    name\n    description\n    status\n    city {\n      id\n      ...City_Basic\n    }\n  }\n'
): typeof import('./graphql').SellerSpot_DetailFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_SellerSpotDetail($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      ...SellerSpot_Detail\n    }\n  }\n'
): typeof import('./graphql').Page_SellerSpotDetailDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_SellerBookSpot($availabilityId: ID!) {\n    bookAvailability(input: { availabilityId: $availabilityId }) {\n      id\n      status\n      bookedAt\n    }\n  }\n'
): typeof import('./graphql').Page_SellerBookSpotDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_SellerAvailabilitiesQuery($date: Date!, $q: String) {\n    availabilitiesByCityDate(input: { date: $date }) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          latitude\n          longitude\n          city {\n            name\n          }\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_SellerAvailabilitiesQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_SellerAvailabilities_Book($availabilityId: ID!) {\n    bookAvailability(input: { availabilityId: $availabilityId }) {\n      id\n      status\n    }\n  }\n'
): typeof import('./graphql').Page_SellerAvailabilities_BookDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_WholesaleCheckoutMutation($input: WholesaleCheckoutInput!) {\n    wholesaleCheckout(input: $input) {\n      id\n      status\n      totalAmount\n      currency\n    }\n  }\n'
): typeof import('./graphql').Page_WholesaleCheckoutMutationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment Country_Basic on PublicCountry {\n    id\n    name\n    code\n  }\n'
): typeof import('./graphql').Country_BasicFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment City_Basic on City {\n    id\n    name\n    code\n  }\n'
): typeof import('./graphql').City_BasicFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment Address_Basic on PublicAddress {\n    id\n    addressLine1\n    addressLine2\n    postalCode\n  }\n'
): typeof import('./graphql').Address_BasicFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotDefinition_Basic on SpotDefinition {\n    id\n    name\n    description\n    status\n    latitude\n    longitude\n    updatedAt\n    city {\n      ...City_Basic\n    }\n  }\n'
): typeof import('./graphql').SpotDefinition_BasicFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotAvailability_ListItem on SpotAvailability {\n    id\n    date\n    status\n    spotDefinition {\n      id\n      ...SpotDefinition_Basic\n    }\n  }\n'
): typeof import('./graphql').SpotAvailability_ListItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment Booking_ListItem on Booking {\n    id\n    status\n    bookedAt\n    complianceBadgeAtBooking\n  }\n'
): typeof import('./graphql').Booking_ListItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_StritMeForOnboardingManager {\n    me {\n      id\n      onboardingCompleted\n      onboardingStep\n      metadata\n    }\n    myOrganizations {\n      id\n      name\n      type\n      onboardingCompleted\n      onboardingStep\n    }\n  }\n'
): typeof import('./graphql').Page_StritMeForOnboardingManagerDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n          mutation Auth_Unlink($providerId: String!) {\n            unlinkProvider(providerId: $providerId)\n          }\n        '
): typeof import('./graphql').Auth_UnlinkDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query Auth_ConnectionStatus {\n        connectionStatus {\n          linkedProviders\n        }\n      }\n    '
): typeof import('./graphql').Auth_ConnectionStatusDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_SellerBookingsQuery {\n    myBookings {\n      id\n      status\n      bookedAt\n      spotAvailability {\n        date\n        spotAvailabilityDefinition {\n          feeReference\n          maxCapacity\n        }\n      }\n      spotDefinition {\n        name\n        latitude\n        longitude\n        city {\n          name\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').Page_SellerBookingsQueryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation page_SellerBookings_Cancel($id: ID!) {\n    cancelBooking(input: { id: $id }) {\n      id\n      status\n      cancelledAt\n    }\n  }\n'
): typeof import('./graphql').Page_SellerBookings_CancelDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotDetailHeader_Spot on SpotDefinition {\n    id\n    name\n    status\n  }\n'
): typeof import('./graphql').SpotDetailHeader_SpotFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotDetailHeader_PrimaryDef on SpotAvailabilityDefinition {\n    timezone\n    startDate\n    frequency\n    interval\n    byWeekday\n    byMonthday\n    endsCount\n    endsAt\n  }\n'
): typeof import('./graphql').SpotDetailHeader_PrimaryDefFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotMeta_Spot on SpotDefinition {\n    id\n    status\n    city {\n      ...City_Basic\n    }\n  }\n'
): typeof import('./graphql').SpotMeta_SpotFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotLocation_Spot on SpotDefinition {\n    id\n    name\n    latitude\n    longitude\n  }\n'
): typeof import('./graphql').SpotLocation_SpotFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SpotOccurrenceItem on SpotAvailability {\n    id\n    date\n    status\n  }\n'
): typeof import('./graphql').SpotOccurrenceItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SpotDetail_Definition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      id\n      name\n      description\n      status\n      latitude\n      longitude\n      city {\n        id\n        name\n      }\n      spotAvailabilityDefinition {\n        id\n        timezone\n        startDate\n        frequency\n        interval\n        byWeekday\n        byMonthday\n        endsCount\n        endsAt\n        isActive\n        maxCapacity\n      }\n    }\n  }\n'
): typeof import('./graphql').SpotDetail_DefinitionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SpotDetail_Occurrences(\n    $availabilityDefinitionId: ID!\n    $start: Date!\n    $end: Date!\n  ) {\n    occurrencesByAvailabilityDefinition(\n      input: {\n        availabilityDefinitionId: $availabilityDefinitionId\n        start: $start\n        end: $end\n      }\n    ) {\n      id\n      date\n      status\n    }\n  }\n'
): typeof import('./graphql').SpotDetail_OccurrencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SpotDetail_SetPublish($id: ID!, $publish: Boolean!) {\n    setSpotDefinitionPublish(input: { id: $id, publish: $publish }) {\n      id\n      status\n      updatedAt\n    }\n  }\n'
): typeof import('./graphql').SpotDetail_SetPublishDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query EditSpot_SpotDefinition($id: ID!) {\n    spotDefinition(input: { id: $id }) {\n      ...SellerSpot_Detail\n    }\n  }\n'
): typeof import('./graphql').EditSpot_SpotDefinitionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query EditSpot_AvailabilityDef($spotDefinitionId: ID!) {\n    availabilityDefinitionBySpotDefinition(\n      input: { spotDefinitionId: $spotDefinitionId }\n    ) {\n      id\n      timezone\n      startDate\n      frequency\n      interval\n      byWeekday\n      byMonthday\n      endsCount\n      endsAt\n      isActive\n      feeReference\n      maxCapacity\n    }\n  }\n'
): typeof import('./graphql').EditSpot_AvailabilityDefDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation EditSpot_UpsertAvailabilityDefinition(\n    $input: UpsertAvailabilityDefinitionInput!\n  ) {\n    upsertAvailabilityDefinition(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').EditSpot_UpsertAvailabilityDefinitionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_AvailabilityHeatmap(\n    $bbox: BBoxInput!\n    $date: String!\n    $resolution: Int!\n  ) {\n    availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {\n      id\n      count\n      geometry\n      h3Index\n    }\n  }\n'
): typeof import('./graphql').Page_AvailabilityHeatmapDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_BookingsHeatmap(\n    $bbox: BBoxInput!\n    $dateRange: DateRangeInput!\n    $resolution: Int!\n  ) {\n    bookingsHeatmap(\n      bbox: $bbox\n      dateRange: $dateRange\n      resolution: $resolution\n    ) {\n      id\n      count\n      geometry\n      h3Index\n    }\n  }\n'
): typeof import('./graphql').Page_BookingsHeatmapDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query page_CollectivityNewSpot_Cities($q: String, $limit: Int) {\n    cities(input: { q: $q, limit: $limit }) {\n      ...City_Basic\n    }\n  }\n'
): typeof import('./graphql').Page_CollectivityNewSpot_CitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query NewSpot_Conflicts($cityId: ID, $date: Date!) {\n    availabilitiesByCityDate(input: { cityId: $cityId, date: $date }) {\n      id\n      spotDefinition {\n        id\n        name\n      }\n    }\n  }\n'
): typeof import('./graphql').NewSpot_ConflictsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation NewSpot_UpsertSpotDefinition($input: UpsertSpotDefinitionInput!) {\n    upsertSpotDefinition(input: $input) {\n      id\n      name\n      city {\n        id\n      }\n    }\n  }\n'
): typeof import('./graphql').NewSpot_UpsertSpotDefinitionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation NewSpot_UpsertAvailabilityDefinition(\n    $input: UpsertAvailabilityDefinitionInput!\n  ) {\n    upsertAvailabilityDefinition(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').NewSpot_UpsertAvailabilityDefinitionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation NewSpot_CreateSpotWithAvailability(\n    $input: CreateSpotWithAvailabilityInput!\n  ) {\n    createSpotWithAvailability(input: $input) {\n      id\n    }\n  }\n'
): typeof import('./graphql').NewSpot_CreateSpotWithAvailabilityDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AvailabilityHeatmap(\n    $bbox: BBoxInput!\n    $date: String!\n    $resolution: Int!\n  ) {\n    availabilityHeatmap(bbox: $bbox, date: $date, resolution: $resolution) {\n      id\n      h3Index\n      count\n      geometry\n    }\n  }\n'
): typeof import('./graphql').AvailabilityHeatmapDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query BookingsHeatmap(\n    $bbox: BBoxInput!\n    $dateRange: DateRangeInput!\n    $resolution: Int!\n  ) {\n    bookingsHeatmap(\n      bbox: $bbox\n      dateRange: $dateRange\n      resolution: $resolution\n    ) {\n      id\n      h3Index\n      count\n      geometry\n    }\n  }\n'
): typeof import('./graphql').BookingsHeatmapDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query WholesaleProducts($category: String, $activeOnly: Boolean) {\n    wholesaleProducts(category: $category, activeOnly: $activeOnly) {\n      id\n      name\n      sku\n      description\n      packSize\n      unitPrice\n      stockQuantity\n      category\n      subcategory\n      isActive\n    }\n  }\n'
): typeof import('./graphql').WholesaleProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyWholesaleOrders {\n    myWholesaleOrders {\n      id\n      sellerId\n      totalAmount\n      currency\n      status\n      createdAt\n      updatedAt\n      items {\n        id\n        productId\n        quantity\n        unitPrice\n        totalPrice\n      }\n    }\n  }\n'
): typeof import('./graphql').MyWholesaleOrdersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Cities($input: SearchCitiesInput!) {\n    cities(input: $input) {\n      id\n      name\n      code\n      countryId\n    }\n  }\n'
): typeof import('./graphql').CitiesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AvailabilitiesByCityDate($date: Date!, $cityId: ID, $limit: Int) {\n    availabilitiesByCityDate(\n      input: { date: $date, cityId: $cityId, limit: $limit }\n    ) {\n      id\n      date\n      status\n      spotAvailabilityDefinition {\n        spotDefinition {\n          id\n          name\n          latitude\n          longitude\n          city {\n            id\n            name\n          }\n          status\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').AvailabilitiesByCityDateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Hooks_MyActiveOrg {\n    myActiveOrganization {\n      id\n      name\n      slug\n      type\n    }\n  }\n'
): typeof import('./graphql').Hooks_MyActiveOrgDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
