/**
 * Istanbul JSON coverage report parser.
 *
 * Parses the standard Istanbul JSON format used by:
 * - Vitest (with coverage.reporter = ['json'])
 * - Bun (with --coverage)
 * - Jest (with collectCoverage and json reporter)
 * - NYC (directly)
 */

import type { CoverageReport, FileCoverage, CoverageData } from '../types';

function calculatePct(covered: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((covered / total) * 100 * 100) / 100;
}

/**
 * Istanbul JSON coverage format.
 */
type IstanbulCoverage = Record<string, IstanbulFileCoverage>;

interface IstanbulFileCoverage {
  path: string;
  statementMap: Record<string, IstanbulLocation>;
  fnMap: Record<string, IstanbulFunction>;
  branchMap: Record<string, IstanbulBranch>;
  s: Record<string, number>; // statement execution counts
  f: Record<string, number>; // function execution counts
  b: Record<string, number[]>; // branch execution counts
}

interface IstanbulLocation {
  start: { line: number; column: number };
  end: { line: number; column: number };
}

interface IstanbulFunction {
  name: string;
  decl: IstanbulLocation;
  loc: IstanbulLocation;
  line: number;
}

interface IstanbulBranch {
  type: string;
  loc: IstanbulLocation;
  locations: IstanbulLocation[];
  line: number;
}

/**
 * Parse Istanbul JSON coverage report.
 *
 * @param content - The JSON content as a string
 * @returns Parsed coverage report
 */
export function parseIstanbulCoverage(content: string): CoverageReport {
  const data: IstanbulCoverage = JSON.parse(content);
  const files = new Map<string, FileCoverage>();

  // Aggregate totals
  let totalStatements = 0;
  let coveredStatements = 0;
  let totalBranches = 0;
  let coveredBranches = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalLines = 0;
  let coveredLines = 0;

  for (const [filePath, fileCoverage] of Object.entries(data)) {
    const parsed = parseFileCoverage(filePath, fileCoverage);
    files.set(filePath, parsed);

    // Accumulate totals
    totalStatements += parsed.statements.total;
    coveredStatements += parsed.statements.covered;
    totalBranches += parsed.branches.total;
    coveredBranches += parsed.branches.covered;
    totalFunctions += parsed.functions.total;
    coveredFunctions += parsed.functions.covered;
    totalLines += parsed.lines.total;
    coveredLines += parsed.lines.covered;
  }

  const total: CoverageData = {
    statements: {
      covered: coveredStatements,
      total: totalStatements,
      pct: calculatePct(coveredStatements, totalStatements),
    },
    branches: {
      covered: coveredBranches,
      total: totalBranches,
      pct: calculatePct(coveredBranches, totalBranches),
    },
    functions: {
      covered: coveredFunctions,
      total: totalFunctions,
      pct: calculatePct(coveredFunctions, totalFunctions),
    },
    lines: {
      covered: coveredLines,
      total: totalLines,
      pct: calculatePct(coveredLines, totalLines),
    },
  };

  return { files, total };
}

/**
 * Parse coverage data for a single file.
 */
function parseFileCoverage(
  path: string,
  coverage: IstanbulFileCoverage
): FileCoverage {
  // Count statements
  const statementTotal = Object.keys(coverage.statementMap).length;
  const statementCovered = Object.values(coverage.s).filter(
    (c) => c > 0
  ).length;

  // Count functions
  const functionTotal = Object.keys(coverage.fnMap).length;
  const functionCovered = Object.values(coverage.f).filter((c) => c > 0).length;

  // Count branches (each branch can have multiple paths)
  let branchTotal = 0;
  let branchCovered = 0;
  for (const branch of Object.values(coverage.b)) {
    branchTotal += branch.length;
    branchCovered += branch.filter((c) => c > 0).length;
  }

  // Calculate line coverage from statement map
  const lineSet = new Set<number>();
  const coveredLineSet = new Set<number>();

  for (const [id, location] of Object.entries(coverage.statementMap)) {
    for (let line = location.start.line; line <= location.end.line; line++) {
      lineSet.add(line);
      if ((coverage.s[id] ?? 0) > 0) {
        coveredLineSet.add(line);
      }
    }
  }

  return {
    path,
    statements: {
      covered: statementCovered,
      total: statementTotal,
      pct: calculatePct(statementCovered, statementTotal),
    },
    branches: {
      covered: branchCovered,
      total: branchTotal,
      pct: calculatePct(branchCovered, branchTotal),
    },
    functions: {
      covered: functionCovered,
      total: functionTotal,
      pct: calculatePct(functionCovered, functionTotal),
    },
    lines: {
      covered: coveredLineSet.size,
      total: lineSet.size,
      pct: calculatePct(coveredLineSet.size, lineSet.size),
    },
  };
}
