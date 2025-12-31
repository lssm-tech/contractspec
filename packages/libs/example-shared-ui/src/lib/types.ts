export type TemplateId = string;

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  presentations?: string[];
  [key: string]: any;
}
