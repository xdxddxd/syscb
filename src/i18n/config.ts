export const locales = ['pt-BR', 'es', 'en'] as const;
export const defaultLocale = 'pt-BR' as const;

export type Locale = typeof locales[number];
