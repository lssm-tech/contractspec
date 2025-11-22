export interface ExpressionContext {
  data: Record<string, unknown>;
  input?: unknown;
  output?: unknown;
}

export function evaluateExpression(
  expression: string | undefined,
  ctx: ExpressionContext
): boolean {
  if (!expression) return true;
  const trimmed = expression.trim();
  if (!trimmed) return true;

  const orParts = splitByOperator(trimmed, '||');
  if (orParts.length > 1)
    return orParts.some((part) => evaluateExpression(part, ctx));

  const andParts = splitByOperator(trimmed, '&&');
  if (andParts.length > 1)
    return andParts.every((part) => evaluateExpression(part, ctx));

  return evaluateSingle(trimmed, ctx);
}

function evaluateSingle(expr: string, ctx: ExpressionContext): boolean {
  const trimmed = expr.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('!')) return !evaluateSingle(trimmed.slice(1), ctx);

  const comparisonMatch = trimmed.match(
    /^(data|input|output)\.([A-Za-z0-9_.\[\]]+)\s*(===|==|!==|!=|>=|<=|>|<)\s*(.+)$/
  );
  if (comparisonMatch) {
    const [, root, path, operator, rawRight] = comparisonMatch as [
      string,
      string,
      string,
      ComparisonOperator,
      string,
    ];
    const left = resolveRoot(root, ctx, path);
    const right = parseLiteral(rawRight);
    return compare(left, right, operator);
  }

  const truthyMatch = trimmed.match(
    /^(data|input|output)\.([A-Za-z0-9_.\[\]]+)$/
  );
  if (truthyMatch) {
    const [, root, path] = truthyMatch as [string, string, string];
    const value = resolveRoot(root, ctx, path);
    return Boolean(value);
  }

  const literal = parseLiteral(trimmed);
  return Boolean(literal);
}

type ComparisonOperator = '===' | '==' | '!==' | '!=' | '>=' | '<=' | '>' | '<';

function compare(
  left: unknown,
  right: unknown,
  operator: ComparisonOperator
): boolean {
  switch (operator) {
    case '===':
    case '==':
      return left === right;
    case '!==':
    case '!=':
      return left !== right;
    case '>':
      return Number(left) > Number(right);
    case '>=':
      return Number(left) >= Number(right);
    case '<':
      return Number(left) < Number(right);
    case '<=':
      return Number(left) <= Number(right);
    default:
      return false;
  }
}

function parseLiteral(value: string): unknown {
  const trimmed = (value ?? '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  )
    return trimmed.slice(1, -1);
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (/^true$/i.test(trimmed)) return true;
  if (/^false$/i.test(trimmed)) return false;
  if (/^null$/i.test(trimmed)) return null;
  if (/^undefined$/i.test(trimmed)) return undefined;
  return trimmed;
}

function resolveRoot(
  root: string,
  ctx: ExpressionContext,
  path: string
): unknown {
  const source =
    root === 'data' ? ctx.data : root === 'input' ? ctx.input : ctx.output;
  return resolvePath(source, path);
}

function resolvePath(source: unknown, path: string): unknown {
  if (source == null) return undefined;
  if (!path) return source;
  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let current: any = source;
  for (const segment of segments) {
    if (current == null) return undefined;
    current = current[segment as keyof typeof current];
  }
  return current;
}

function splitByOperator(expr: string, operator: '&&' | '||'): string[] {
  const parts: string[] = [];
  let buffer = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i]!;
    const next = expr.slice(i, i + operator.length);

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      buffer += char;
      continue;
    }
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      buffer += char;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && next === operator) {
      parts.push(buffer.trim());
      buffer = '';
      i += operator.length - 1;
      continue;
    }

    buffer += char;
  }

  if (buffer.trim().length) parts.push(buffer.trim());
  return parts;
}
