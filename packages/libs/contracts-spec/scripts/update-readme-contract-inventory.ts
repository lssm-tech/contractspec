import path from 'node:path';
import { updateReadmeInventory } from './readme-inventory.ts';

const result = updateReadmeInventory();

console.log(
  `readme:inventory updated ${path.join('README.md')} with ${result.exportsCount} exports and ${result.categoryCount} categories.`
);
