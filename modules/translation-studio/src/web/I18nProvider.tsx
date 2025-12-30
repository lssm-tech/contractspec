'use client';

import type React from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../i18n';

interface Props {
  children: React.ReactNode;
}

const Provider = I18nextProvider;

export const I18nProvider = ({ children }: Props) => (
  <Provider i18n={i18n}>{children}</Provider>
);
