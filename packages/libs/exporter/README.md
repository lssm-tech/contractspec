# @lssm/lib.exporter

Platform-agnostic utilities for exporting data to CSV and XML formats.

## Purpose

To provide a lightweight, dependency-free way to generate CSV and XML files on both the server (Node.js/Bun) and client (Browser/React Native).

## Installation

```bash
npm install @lssm/lib.exporter
# or
bun add @lssm/lib.exporter
```

## Key Concepts

- **Universal**: Works in any JS environment.
- **Streaming-friendly**: Designed to handle data chunks (conceptually), though current implementation might be synchronous.

## Usage

```ts
import { toCSV, toXML } from '@lssm/lib.exporter';

const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// Generate CSV string
const csv = toCSV(data);

// Generate XML string
const xml = toXML(data, { rootName: 'Users', itemName: 'User' });
```





