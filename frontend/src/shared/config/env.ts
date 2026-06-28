import { z } from 'zod';

export type Env = {
  API_BASE_URL: string;
};

type ClientEnvInput = Record<string, string | boolean | undefined>;

const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .trim()
    .min(1, 'VITE_API_BASE_URL is required.')
    .refine(isValidApiBaseUrl, {
      message:
        'VITE_API_BASE_URL must be an absolute http(s) URL or a root-relative path.',
    }),
});

export function parseClientEnv(rawEnv: ClientEnvInput): Env {
  const result = clientEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.');

        return `${path}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(`Invalid frontend environment configuration:\n${message}`);
  }

  return {
    API_BASE_URL: result.data.VITE_API_BASE_URL,
  };
}

function isValidApiBaseUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return true;
  }

  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const env = parseClientEnv(import.meta.env);
