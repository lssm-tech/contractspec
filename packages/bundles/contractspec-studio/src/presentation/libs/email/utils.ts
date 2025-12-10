'use server';

export const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export const formatMultilineHtml = (value: string): string =>
  escapeHtml(value).replaceAll('\n', '<br />');
