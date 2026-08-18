export function setUserLocalStorage(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function setTokenLocalStorage(token: any) {
  localStorage.setItem("token", JSON.stringify(token));
}

export function setAuthLocalStorage(auth: any) {
  localStorage.setItem("auth", JSON.stringify(auth));
}


export function getUserLocalStorage() {
  const json = localStorage.getItem("user");

  if (!json) {
    return null;
  }

  const user = JSON.parse(json);

  return user ?? null;
}

export function getTokenLocalStorage() {
  const json = localStorage.getItem("token");

  if (!json) {
    return null;
  }

  const token = JSON.parse(json);

  return token ?? null;
}

export function getAuthLocalStorage() {
  const json = localStorage.getItem("auth");

  if (!json) {
    return null;
  }

  const auth = JSON.parse(json);

  return auth ?? null;
}
