/**
 * CalcHub Pro licence service — Cloudflare Worker (free plan is enough).
 * Checks licence keys with the Lemon Squeezy License API and answers the app with
 *   { valid, plan: 'pro' | 'business', expires, instanceId, error }
 *
 * Settings (Worker → Settings → Variables):
 *   LS_STORE_ID          your Lemon Squeezy store id (number)
 *   LS_PRODUCT_ID        the CalcHub Pro product id (number)
 *   BUSINESS_VARIANT_IDS comma-separated variant ids that are Business plans (optional)
 *   ALLOWED_ORIGIN       your app address, e.g. https://yourname.github.io  (no trailing slash)
 * No secret key is needed: the License API is designed to be called with the licence key alone.
 */
const LS = 'https://api.lemonsqueezy.com/v1/licenses/';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = origin === env.ALLOWED_ORIGIN;
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const reply = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply({ valid: false, error: 'Use POST.' }, 405);
    if (!allowed) return reply({ valid: false, error: 'This licence service is for the CalcHub Pro app only.' }, 403);

    let body;
    try { body = await request.json(); } catch { return reply({ valid: false, error: 'Bad request.' }, 400); }
    const { action, key, instance, instanceId } = body || {};
    if (!/^[A-Za-z0-9-]{8,80}$/.test(String(key || ''))) return reply({ valid: false, error: 'That does not look like a licence key.' }, 400);

    const call = async (path, fields) => {
      const r = await fetch(LS + path, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fields),
      });
      return r.json();
    };

    try {
      if (action === 'activate') {
        const d = await call('activate', { license_key: key, instance_name: String(instance || 'CalcHub Pro').slice(0, 100) });
        return reply(shape(d, env, d.activated));
      }
      if (action === 'validate') {
        const f = { license_key: key }; if (instanceId) f.instance_id = instanceId;
        const d = await call('validate', f);
        return reply(shape(d, env, d.valid));
      }
      if (action === 'deactivate') {
        if (!instanceId) return reply({ valid: false, deactivated: false });
        const d = await call('deactivate', { license_key: key, instance_id: instanceId });
        return reply({ valid: false, deactivated: !!d.deactivated });
      }
      return reply({ valid: false, error: 'Unknown action.' }, 400);
    } catch (e) {
      return reply({ valid: false, error: 'The licence check is unavailable. Try again shortly.' }, 502);
    }
  },
};

function shape(d, env, ok) {
  const m = d.meta || {}, lk = d.license_key || {};
  // Only keys sold by this store for this product count.
  if (String(m.store_id) !== String(env.LS_STORE_ID) || String(m.product_id) !== String(env.LS_PRODUCT_ID))
    return { valid: false, error: 'This key is not for CalcHub Pro.' };
  if (!ok || lk.status === 'disabled' || lk.status === 'expired')
    return { valid: false, error: d.error || 'This key is not active.' };
  const business = String(env.BUSINESS_VARIANT_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  return {
    valid: true,
    plan: business.includes(String(m.variant_id)) ? 'business' : 'pro',
    expires: lk.expires_at || null,
    instanceId: d.instance ? d.instance.id : null,
    label: m.variant_name || '',
  };
}
