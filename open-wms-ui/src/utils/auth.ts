const TokenKey = 'Admin-Token';
const TokenTypeKey = 'Admin-Token-Type';

const tokenStorage = useStorage<null | string>(TokenKey, null);
const tokenSessionStorage = useSessionStorage<null | string>(TokenKey, null);
const tokenTypeSessionStorage = useSessionStorage<null | boolean>(TokenTypeKey, null);

export const getToken = () => {
  if (tokenTypeSessionStorage.value) {
    return tokenSessionStorage.value;
  } else {
    return tokenStorage.value;
  }
};

export const setToken = (access_token: string) => {
  if (tokenTypeSessionStorage.value) {
    tokenSessionStorage.value = access_token;
  } else {
    tokenStorage.value = access_token;
  }
};

export const removeToken = () => (tokenStorage.value = null);

/**
 * 开启临时会话token
 * @returns
 */
export const openSessionToken = () => {
  tokenTypeSessionStorage.value = true;
};

/**
 * 关闭临时会话token
 * @returns
 */
export const closeSessionToken = () => {
  tokenTypeSessionStorage.value = null;
};
