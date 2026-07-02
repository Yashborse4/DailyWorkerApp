import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'workerd.auth.tokens';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  lastRefresh: string;
}

export const getTokens = async (): Promise<StoredTokens | null> => {
  const credentials = await Keychain.getGenericPassword({ service: TOKEN_SERVICE });
  if (!credentials) {
    return null;
  }

  try {
    return JSON.parse(credentials.password) as StoredTokens;
  } catch {
    await clearTokens();
    return null;
  }
};

export const setTokens = async (tokens: StoredTokens): Promise<void> => {
  await Keychain.setGenericPassword('tokens', JSON.stringify(tokens), {
    service: TOKEN_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const updateTokens = async (
  accessToken: string,
  refreshToken: string,
  lastRefresh: string = Date.now().toString(),
): Promise<void> => {
  await setTokens({ accessToken, refreshToken, lastRefresh });
};

export const clearTokens = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
};
