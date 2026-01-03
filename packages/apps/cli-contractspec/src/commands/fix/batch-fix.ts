/**
 * Batch fix logic.
 */

import { fix } from '@contractspec/bundle.workspace';

/**
 * Parse issues from CI output JSON file.
 * Expects array of CIIssueWithFixLinks.
 */
export async function parseCiIssues(
  filePath: string,
  fixService: fix.FixService
): Promise<fix.FixableIssue[]> {
  const file = Bun.file(filePath);
  const content = await file.text();

  try {
    const rawData = JSON.parse(content);

    const ciIssues = fix.CiOutputSchema.parse(rawData);
    return fixService.parseIssuesFromCIResult(ciIssues);
  } catch (error) {
    throw new Error(
      `Failed to parse CI issues file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
