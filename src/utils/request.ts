const API_HOST = "http://localhost:8000";
const API_ROUTE = "/api";

/**
 * Envoie une requête et renvoie le JSON de retour dans une promesse.
 * Si la réponse est 401 Unauthorized, le client est redirigé vers la page de connexion.
 *
 * @param method
 * @param url URL de la requête
 * @param body JSON a envoyer
 * @param params
 * @returns Promesse contenant le JSON de réponse
 */
const send = (
  method: string,
  url: string,
  body: object | FormData | null = null,
  params: object = {},
): Promise<object | null> => {
  const data =
    Object.prototype.toString.call(body) === FormData.prototype.toString()
      ? Object.fromEntries(body as FormData)
      : body;

  return fetch(API_HOST + API_ROUTE + url, {
    method: method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: data ? JSON.stringify(data) : null,
    ...params,
  }).then((res) => {
    switch (res.status) {
      case 401:
        window.location.assign("/login");
        break;
      case 400:
      case 404:
      case 422:
        return Promise.reject(res);
      default:
        return res.json().catch(() => null);
    }
  });
};

/**
 * Collection de fonctions de permettant d'envoyer des requête AJAX
 * tout en vérifiant l'authentification.
 */
const request = {
  /**
   * Envoie une requête GET et retourne le JSON dans une promesse.
   * Si la réponse est 401 Unauthorized, le client est redirigé vers la page de connexion.
   */
  get: (
    url: string,
    params: Record<string, string> | null,
  ): Promise<object | null> => {
    let full_url = url;
    if (params) {
      full_url += "?" + new URLSearchParams(params).toString();
    }

    return send("GET", full_url);
  },

  /**
   * Envoie une requête POST et retourne le JSON dans une promesse.
   * Si la réponse est 401 Unauthorized, le client est redirigé vers la page de connexion.
   *
   * @param url URL de la requête
   * @param body JSON a envoyer
   * @returns Promesse contenant le JSON de réponse
   */
  post: (url: string, body: object | FormData): Promise<object | null> => {
    return send("POST", url, body);
  },

  /**
   * Envoie une requête PUT et retourne le JSON dans une promesse.
   * Si la réponse est 401 Unauthorized, le client est redirigé vers la page de connexion.
   *
   * @param url URL de la requête
   * @param body JSON a envoyer
   * @returns Promesse contenant le JSON de réponse
   */
  put: (url: string, body: object | FormData): Promise<object | null> => {
    return send("PUT", url, body);
  },

  /**
   * Envoie une requête GET et retourne le JSON dans une promesse.
   * Si la réponse est 401 Unauthorized, le client est redirigé vers la page de connexion.
   */
  delete: (url: string): Promise<object | null> => send("DELETE", url),
};

export default request;
