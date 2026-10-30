import emailjs from '@emailjs/browser';

const config = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  adminTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  customerTemplateId: import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

let initialized = false;
const inFlight = new Set();

function setup() {
  const missing = [
    !config.serviceId && 'VITE_EMAILJS_SERVICE_ID',
    !config.publicKey && 'VITE_EMAILJS_PUBLIC_KEY',
  ].filter(Boolean);
  if (missing.length) {
    return { ok: false, error: `EmailJS is missing configuration: ${missing.join(', ')}.` };
  }
  if (!initialized) {
    emailjs.init({
      publicKey: config.publicKey,
      blockHeadless: true,
    });
    initialized = true;
  }
  return { ok: true };
}

async function send(templateId, params, key) {
  if (inFlight.has(key)) return { ok: false, error: 'This email is already being sent.' };
  const ready = setup();
  if (!ready.ok) return ready;
  if (!templateId) return { ok: false, error: `EmailJS is missing the ${key === 'admin' ? 'VITE_EMAILJS_TEMPLATE_ID' : 'VITE_EMAILJS_WELCOME_TEMPLATE_ID'} setting.` };
  inFlight.add(key);
  try {
    const response = await emailjs.send(config.serviceId, templateId, params, {
      publicKey: config.publicKey,
      limitRate: { id: `kavro-${key}`, throttle: 1000 },
    });
    return { ok: true, status: response.status };
  } catch (error) {
    const message = error?.text || error?.message || 'Email delivery failed. Check your connection and try again.';
    return { ok: false, error: message };
  } finally {
    inFlight.delete(key);
  }
}

export function sendAdminNotification(params) {
  return send(config.adminTemplateId, params, 'admin');
}

export function sendCustomerWelcome(params) {
  return send(config.customerTemplateId, params, 'customer');
}

export async function sendEnquiryNotifications(params, previous = {}) {
  const admin = previous.adminSent ? { ok: true, skipped: true } : await sendAdminNotification(params);
  if (!previous.customerSent && !previous.adminSent) await new Promise((resolve) => setTimeout(resolve, 1100));
  const customer = previous.customerSent ? { ok: true, skipped: true } : await sendCustomerWelcome(params);
  const adminSent = Boolean(previous.adminSent || admin.ok);
  const customerSent = Boolean(previous.customerSent || customer.ok);
  return {
    adminSent,
    customerSent,
    success: adminSent && customerSent,
    admin,
    customer,
  };
}
