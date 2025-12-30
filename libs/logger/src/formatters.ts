import type { Formatter, LogEntry } from './types';
import { LogLevel } from './types';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

// Log level colors and symbols
const levelConfig = {
  [LogLevel.TRACE]: { color: colors.gray, symbol: '○', name: 'TRACE' },
  [LogLevel.DEBUG]: { color: colors.blue, symbol: '●', name: 'DEBUG' },
  [LogLevel.INFO]: { color: colors.green, symbol: '●', name: 'INFO ' },
  [LogLevel.WARN]: { color: colors.yellow, symbol: '▲', name: 'WARN ' },
  [LogLevel.ERROR]: { color: colors.red, symbol: '✖', name: 'ERROR' },
  [LogLevel.FATAL]: {
    color: colors.bgRed + colors.white,
    symbol: '💀',
    name: 'FATAL',
  },
};

export class DevFormatter implements Formatter {
  private enableColors: boolean;

  constructor(enableColors = true) {
    this.enableColors = enableColors;
  }

  format(entry: LogEntry): string {
    const parts: string[] = [];
    const config = levelConfig[entry.level];

    // Timestamp
    const timestamp = this.formatTimestamp(entry.timestamp);
    parts.push(this.colorize(timestamp, colors.gray));

    // Log level with symbol
    const levelText = `${config.symbol} ${config.name}`;
    parts.push(this.colorize(levelText, config.color));

    // Trace information
    if (entry.traceId) {
      const traceInfo = this.formatTraceInfo(entry);
      parts.push(this.colorize(traceInfo, colors.cyan));
    }

    // Main message
    parts.push(this.colorize(entry.message, colors.white));

    // Duration (if present)
    if (entry.duration !== undefined) {
      const durationText = `(${this.formatDuration(entry.duration)})`;
      parts.push(this.colorize(durationText, colors.magenta));
    }

    let output = parts.join(' ');

    // Context and metadata (on new lines for readability)
    if (entry.context && Object.keys(entry.context).length > 0) {
      output += '\n' + this.formatContext(entry.context);
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      output += '\n' + this.formatMetadata(entry.metadata);
    }

    // Error details
    if (entry.error) {
      output += '\n' + this.formatError(entry.error);
    }

    // Tags
    if (entry.tags && entry.tags.length > 0) {
      const tagsText = entry.tags.map((tag) => `#${tag}`).join(' ');
      output += '\n' + this.colorize(`Tags: ${tagsText}`, colors.blue);
    }

    return output;
  }

  private formatTimestamp(timestamp: Date): string {
    return timestamp.toISOString().substring(11, 23); // Just time with milliseconds
  }

  private formatTraceInfo(entry: LogEntry): string {
    const parts = [`trace:${entry.traceId?.substring(0, 8) || 'unknown'}`];
    if (entry.spanId && entry.spanId.length >= 8) {
      parts.push(`span:${entry.spanId.substring(0, 8)}`);
    }
    if (entry.parentId && entry.parentId.length >= 8) {
      parts.push(`parent:${entry.parentId.substring(0, 8)}`);
    }
    return `[${parts.join('|')}]`;
  }

  private formatDuration(duration: number): string {
    if (duration < 1) {
      return `${(duration * 1000).toFixed(0)}μs`;
    } else if (duration < 1000) {
      return `${duration.toFixed(2)}ms`;
    } else {
      return `${(duration / 1000).toFixed(2)}s`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatContext(context: Record<string, any>): string {
    const formatted = this.formatObject(context, 2);
    return this.colorize(`Context: ${formatted}`, colors.cyan);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatMetadata(metadata: Record<string, any>): string {
    const formatted = this.formatObject(metadata, 2);
    return this.colorize(`Metadata: ${formatted}`, colors.blue);
  }

  private formatError(error: Error): string {
    let output = this.colorize(
      `Error: ${error.name}: ${error.message}`,
      colors.red
    );
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(1, 6); // First 5 stack frames
      const indentedStack = stackLines.map((line) => `  ${line}`).join('\n');
      output += '\n' + this.colorize(indentedStack, colors.gray);
    }
    return output;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatObject(obj: Record<string, any>, indent = 0): string {
    const spaces = ' '.repeat(indent);
    const entries = Object.entries(obj);

    if (entries.length === 0) return '{}';

    if (entries[0] && typeof entries[0][1] !== 'object') {
      return `{ ${entries[0][0]}: ${this.formatValue(entries[0][1])} }`;
    }

    const formatted = entries
      .map(([key, value]) => {
        return `${spaces}  ${key}: ${this.formatValue(value, indent + 2)}`;
      })
      .join('\n');

    return `{\n${formatted}\n${spaces}}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatValue(value: any, indent = 0): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean' || typeof value === 'number')
      return String(value);
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      return `[${value.map((v) => this.formatValue(v)).join(', ')}]`;
    }
    if (typeof value === 'object') {
      return this.formatObject(value, indent);
    }
    return String(value);
  }

  private colorize(text: string, color: string): string {
    if (!this.enableColors) return text;
    return `${color}${text}${colors.reset}`;
  }
}

export class ProductionFormatter implements Formatter {
  format(entry: LogEntry): string {
    const logObject: LogEntry = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
    };

    // Add trace information
    if (entry.traceId) {
      logObject.traceId = entry.traceId;
    }
    if (entry.spanId) {
      logObject.spanId = entry.spanId;
    }
    if (entry.parentId) {
      logObject.parentId = entry.parentId;
    }

    // Add timing information
    if (entry.duration !== undefined) {
      logObject.duration = entry.duration;
    }

    // Add context and metadata
    if (entry.context && Object.keys(entry.context).length > 0) {
      logObject.context = entry.context;
    }
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      logObject.metadata = entry.metadata;
    }

    // Add error information
    if (entry.error) {
      logObject.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack,
      };
    }

    // Add tags
    if (entry.tags && entry.tags.length > 0) {
      logObject.tags = entry.tags;
    }

    return JSON.stringify(logObject);
  }
}

export class CustomFormatter implements Formatter {
  private template: string;
  private dateFormat: (date: Date) => string;

  constructor(
    template = '{timestamp} [{level}] {message}',
    dateFormat?: (date: Date) => string
  ) {
    this.template = template;
    this.dateFormat = dateFormat || ((date: Date) => date.toISOString());
  }

  format(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = this.dateFormat(entry.timestamp);

    let formatted = this.template
      .replace('{timestamp}', timestamp)
      .replace('{level}', levelName)
      .replace('{message}', entry.message)
      .replace('{traceId}', entry.traceId || '')
      .replace('{spanId}', entry.spanId || '')
      .replace('{duration}', entry.duration?.toString() || '');

    // Handle context and metadata placeholders
    if (entry.context) {
      formatted = formatted.replace('{context}', JSON.stringify(entry.context));
    }
    if (entry.metadata) {
      formatted = formatted.replace(
        '{metadata}',
        JSON.stringify(entry.metadata)
      );
    }

    return formatted;
  }
}
