import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from '@/components/structured-data';

interface PageWithSEOProps {
  children: React.ReactNode;
  title: string;
  description: string;
  url: string;
  breadcrumbs?: { name: string; url: string }[];
  datePublished?: string;
  dateModified?: string;
}

export function PageWithSEO({
  children,
  title,
  description,
  url,
  breadcrumbs,
  datePublished,
  dateModified,
}: PageWithSEOProps) {
  return (
    <>
      {breadcrumbs && <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />}
      <ArticleStructuredData
        title={title}
        description={description}
        url={url}
        datePublished={datePublished}
        dateModified={dateModified}
      />
      {children}
    </>
  );
}
