import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Locale } from '../i18n/config';

type Messages = Record<string, any>;

// Hook customizado para traduções
export function useTranslations() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'pt-BR';
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = await import(`../../messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback para pt-BR
        try {
          const fallbackMsgs = await import('../../messages/pt-BR.json');
          setMessages(fallbackMsgs.default);
        } catch (fallbackError) {
          console.error('Error loading fallback messages:', fallbackError);
        }
      }
    };

    loadMessages();
  }, [locale]);

  const t = (key: string, values?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Substituir valores se fornecidos
    if (values) {
      return Object.entries(values).reduce((text, [placeholder, replacement]) => {
        return text.replace(`{${placeholder}}`, String(replacement));
      }, value);
    }

    return value;
  };

  return t;
}
