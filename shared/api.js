(() => {
  'use strict';
  const base = window.ProjectAPIConfig?.baseURL;
  async function request(path, { method = 'GET', body, token, signal, responseType = 'json', headers = {} } = {}) {
    if (!base) throw Object.assign(new Error('El servicio de citas no está configurado.'), { code: 'not_configured', status: 503 });
    if (!path.startsWith('/api/')) throw new Error('Ruta de servicio inválida.');
    const controller = new AbortController();
    const abort = () => controller.abort(signal?.reason);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(() => controller.abort(), 60000);
    const outgoing = new Headers(headers);
    outgoing.set('Accept', responseType === 'blob' ? '*/*' : 'application/json');
    if (token) outgoing.set('Authorization', `Bearer ${token}`);
    if (body != null && !(body instanceof FormData)) {
      outgoing.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }
    try {
      const response = await fetch(base.replace(/\/$/, '') + path, {
        method, headers: outgoing, body, signal: controller.signal,
        credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer'
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.error?.message || 'No se pudo completar la operación.');
        error.code = data.error?.code || 'service_error';
        error.status = response.status;
        error.retryAfter = response.headers.get('Retry-After');
        throw error;
      }
      if (response.status === 204) return null;
      return await (responseType === 'blob' ? response.blob() : response.json());
    } catch (error) {
      if (error.status || error.name === 'AbortError') throw error;
      throw Object.assign(new Error('No hay conexión con el servicio. Tus datos siguen en el formulario; puedes reintentar.'), { code: 'network_error', cause: error });
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }
  function createAppointment(payload, { idempotencyKey, files = {}, signal } = {}) {
    if (!idempotencyKey) throw new Error('Falta el identificador de la solicitud.');
    const data = new FormData();
    data.set('payload', JSON.stringify(payload));
    for (const name of ['currentPhoto', 'inspirationPhoto']) {
      if (files[name]) data.set(name, files[name]);
    }
    return request('/api/appointments', { method: 'POST', body: data, signal, headers: { 'Idempotency-Key': idempotencyKey } });
  }
  window.ProjectAPI = Object.freeze({
    request,
    availability: ({ signal } = {}) => request('/api/availability', { signal }),
    createAppointment
  });
})();
