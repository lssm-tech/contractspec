export * from './types/navigation';

// Atoms
export * from './renderers';
export { Cta } from './components/atoms/Cta';
export { Button } from './components/atoms/Button';
export { ButtonLink } from './components/atoms/ButtonLink';
export { Link } from './components/atoms/Link';
export { Input } from './components/atoms/Input';
export { Textarea } from './components/atoms/Textarea';
export { EmptyState } from './components/atoms/EmptyState';
// export { ErrorState } from './components/atoms/ErrorState';
export { Stepper } from './components/atoms/Stepper';
export {
  EditButton,
  DeleteButton,
  ViewButton,
  ToggleButton,
  ToggleLeftButton,
  ToggleRightButton,
} from './components/atoms/ActionButtons';
export {
  DateChip,
  TimeChip,
  PlaceChip,
  DurationChip,
} from './components/atoms/DataChips';

// Molecules
export { NavMain } from './components/molecules/NavMain';
export { NavUser } from './components/molecules/NavUser';
export { ApprovalQueue } from './components/agent/ApprovalQueue';
export { AgentMonitor } from './components/agent/AgentMonitor';

// Code display components
export {
  CodeBlock,
  type CodeBlockProps,
  type CodeLanguage,
} from './components/molecules/CodeBlock';
export {
  CopyButton,
  type CopyButtonProps,
} from './components/molecules/CopyButton';
export {
  CommandTabs,
  type CommandTabsProps,
  type PackageManager,
  type PackageManagerContextValue,
} from './components/molecules/CommandTabs';
export {
  InstallCommand,
  type InstallCommandProps,
  type InstallCommandType,
} from './components/molecules/InstallCommand';
export {
  PackageManagerProvider,
  usePackageManager,
  type PackageManagerProviderProps,
} from './components/providers/PackageManagerProvider';

// Organisms
export { AppSidebar } from './components/organisms/AppSidebar';
export {
  Header,
  DesktopHeader,
  MobileHeader,
} from './components/organisms/Header';
export { Footer } from './components/organisms/Footer';
export { FeatureCarousel } from './components/organisms/FeatureCarousel';
export { MarketingHeader } from './components/organisms/MarketingHeader';
export { MarketingHeaderDesktop } from './components/organisms/MarketingHeaderDesktop';
export { MarketingHeaderMobile } from './components/organisms/MarketingHeaderMobile';
export { MarketingLayout } from './components/organisms/MarketingLayout';
export {
  MarketingSection,
  type MarketingSectionTone,
  type MarketingSectionPadding,
} from './components/marketing/MarketingSection';
export { MarketingCardsSection } from './components/marketing/MarketingCardsSection';
export {
  MarketingCard,
  MarketingCardContent,
  MarketingCardDescription,
  MarketingCardHeader,
  MarketingCardTitle,
  type MarketingCardTone,
} from './components/marketing/MarketingCard';
export { MarketingIconCard } from './components/marketing/MarketingIconCard';
export { MarketingStepCard } from './components/marketing/MarketingStepCard';
export { MarketingComparisonSection } from './components/marketing/MarketingComparisonSection';
export { AppLayout } from './components/organisms/AppLayout';
export { AcademyLayout } from './components/organisms/AcademyLayout';
export { AppHeader } from './components/organisms/AppHeader';
// export { AppHeader as AppHeaderMobile } from './components/organisms/AppHeader.mobile';
// export { BottomTabs } from './components/native/BottomTabs.mobile';
// export { SheetMenu } from './components/native/SheetMenu.mobile';
export { CommandPalette } from './components/molecules/CommandPalette';
export { LangSwitch } from './components/molecules/LangSwitch';
export { NavBrand } from './components/atoms/NavBrand';
export { Breadcrumbs } from './components/molecules/Breadcrumbs';
export { CommandSearchTrigger } from './components/molecules/CommandSearchTrigger';
export { StatusChip } from './components/molecules/StatusChip';
export { EntityCard } from './components/molecules/EntityCard';
export { StatCard, StatCardGroup } from './components/molecules/StatCard';
export { OverviewCard } from './components/molecules/OverviewCard';
export { HoverPreview } from './components/molecules/HoverPreview';
export { HoverPreviewSimple } from './components/molecules/hover-previews/Simple';
export { HoverPreviewMedia } from './components/molecules/hover-previews/Media';
export { HoverPreviewDoc } from './components/molecules/hover-previews/Doc';
export { HoverPreviewUser } from './components/molecules/hover-previews/User';
export { HoverPreviewStats } from './components/molecules/hover-previews/Stats';
export { PricingCarousel } from './components/organisms/PricingCarousel';
export { TestimonialCarousel } from './components/organisms/TestimonialCarousel';
export { HeroSection } from './components/organisms/HeroSection';
export { HeroResponsive } from './components/organisms/HeroResponsive';
export { FeaturesSection } from './components/organisms/FeaturesSection';
export { PageHeaderResponsive } from './components/organisms/PageHeaderResponsive';
export { PricingSection } from './components/organisms/PricingSection';
export { FAQSection } from './components/organisms/FAQSection';
export { ListPageResponsive } from './components/organisms/ListPageResponsive';
export { ListGridPage } from './components/organisms/ListGridPage';
export { ListCardPage } from './components/organisms/ListCardPage';
export { ListTablePage } from './components/organisms/ListTablePage';
export { FiltersToolbar } from './components/molecules/FiltersToolbar';
export { ListPageTemplate } from './components/templates/lists/ListPageTemplate';
export { AiLinkButton } from './components/molecules/AiLinkButton';
export { EmptyDataList } from './components/organisms/EmptyDataList';
export { EmptySearchResult } from './components/organisms/EmptySearchResult';
// Loaders & Skeletons
export { LoaderCircular } from './components/atoms/LoaderCircular';
export { LoaderBlock } from './components/molecules/LoaderBlock';
export { SkeletonBlock } from './components/molecules/SkeletonBlock';
export { SkeletonCircle } from './components/molecules/SkeletonCircle';
export { SkeletonList } from './components/molecules/SkeletonList';
export { ErrorState } from './components/atoms/ErrorState';
// export {
//   DropdownMenu,
//   DropdownMenuPortal,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuLabel,
//   DropdownMenuItem,
//   DropdownMenuCheckboxItem,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubTrigger,
//   DropdownMenuSubContent,
// } from './components/molecules/DropdownMenu';
export { useListUrlState } from './hooks/useListUrlState';

// Legal components
export { LegalHeading } from './components/legal/atoms/LegalHeading';
export { LegalText } from './components/legal/atoms/LegalText';
export { LegalSection } from './components/legal/atoms/LegalSection';
export { DefinitionList } from './components/legal/atoms/DefinitionList';
export { KeyValueList } from './components/legal/atoms/KeyValueList';
export { LegalList } from './components/legal/atoms/LegalList';
export { LegalCallout } from './components/legal/atoms/LegalCallout';
export { LegalTOC } from './components/legal/molecules/LegalTOC';
export { LegalMeta } from './components/legal/molecules/LegalMeta';
export { ConsentItem, ConsentList } from './components/legal/molecules/Consent';
export { ContactFields } from './components/legal/molecules/ContactFields';
export * from './components/legal/organisms/LegalPageLayout';
export * from './components/legal/organisms/GDPRRights';
export * from './components/legal/organisms/ContactForm';
export * from './components/legal/organisms/GDPRDataRequest';
export { TermsTemplate } from './components/legal/templates/TermsTemplate';
export { SalesTermsTemplate } from './components/legal/templates/SalesTermsTemplate';
export { PrivacyTemplate } from './components/legal/templates/PrivacyTemplate';
export { CookiesTemplate } from './components/legal/templates/CookiesTemplate';
export { ContactTemplate } from './components/legal/templates/ContactTemplate';
// Platform adapter
export * from './platform/withPlatformUI';
export { useResponsive } from './platform/useResponsive';
export { useReducedMotion } from './platform/useReducedMotion';
export { useColorScheme } from './platform/useColorScheme';
export * from './theme/variants';
export * from './theme/tokens';
export { mapTokensForPlatform } from './theme/tokenBridge';

// Forms
export { FormDialog } from './components/forms/FormDialog';
export { ZodForm } from './components/forms/ZodForm';
export { FormSection, FormRow, FormGrid } from './components/forms/FormLayout';
export { FormCardLayout } from './components/forms/FormCardLayout';
export { FormStepsLayout } from './components/forms/FormStepsLayout';
export { FormOneByOneLayout } from './components/forms/FormOneByOneLayout';
export { ActionForm } from './components/forms/ActionForm';

// Data views
export { DataViewList } from './components/data-view/DataViewList';
export { DataViewTable } from './components/data-view/DataViewTable';
export { DataViewDetail } from './components/data-view/DataViewDetail';
export { DataViewRenderer } from './components/data-view/DataViewRenderer';

// Overlays re-exports (web default; native via Metro alias)
// Overlays are used directly from ui-kit(s) in apps for now to avoid DTS bundling issues
