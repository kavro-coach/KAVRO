import React, { useEffect, useRef, useState } from 'react';
import { sendEnquiryNotifications } from './services/emailService.js';

const WHATSAPP_NUMBER = '918892220980';

const services = [
  { id: 'body-recomposition', number: '01', title: 'Body Recomposition', duration: '6 Months', text: 'Lose chest fat and belly fat and build lean muscle.', image: `${import.meta.env.BASE_URL}card%201.jpeg` },
  { id: 'pcod-thyroid', number: '02', title: 'PCOD/Thyroid Fat Loss', duration: '6 Months', text: 'Fitness guidance for sustainable fat loss and a toned body. Not a medical treatment.', image: `${import.meta.env.BASE_URL}card%202.jpeg` },
  { id: 'weight-loss', number: '03', title: 'Weight Loss', duration: '4 Months', text: 'Drop unwanted fat, improve fitness, and boost confidence fast.', image: `${import.meta.env.BASE_URL}card%203.jpeg` },
  { id: 'weight-loss-women', number: '04', title: 'Weight Loss (Women)', duration: '4 Months', text: 'Drop unwanted fat, improve fitness, and boost confidence fast.', image: `${import.meta.env.BASE_URL}card%204.jpeg` },
  { id: 'lean-muscle-gain', number: '05', title: 'Lean Gaining', duration: '6 Months', text: 'Gain lean muscle without fat and look strong, defined, and athletic.', image: `${import.meta.env.BASE_URL}card%205.jpeg` },
  { id: 'postpartum', number: '06', title: 'Postpartum Transformation', duration: '6 Months', text: 'Rebuild strength, tone your body, and feel confident after pregnancy.', image: `${import.meta.env.BASE_URL}card%206.jpeg` },
];

const values = [
  ['K', 'Knowledge', 'Expert fitness guidance'],
  ['A', 'Action', 'Consistent workouts'],
  ['V', 'Vitality', 'Healthy, energetic living'],
  ['R', 'Results', 'Progress toward your goals'],
  ['O', 'Optimization', 'A better performing you'],
];

export default function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState('');
  const deliveryRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!selectedService) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') setSelectedService(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedService]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (submittingRef.current || !form.reportValidity() || !selectedService) return;
    if (form.elements.website.value) return;
    const values = new FormData(form);
    const photo = values.get('photo');
    const message = `Hello KAVRO,\n\nI would like to enquire about your fitness coaching program.\n\nName: ${values.get('full_name')}\nEmail: ${values.get('email')}\nAge: ${values.get('age')}\nPhone: ${values.get('phone_number')}\nCountry: ${values.get('country')}\nCity: ${values.get('city')}\nGender: ${values.get('gender')}\nPreferred Workout Time: ${values.get('preferred_workout_time')}\n\nSelected Service: ${selectedService.title}\nProgram Duration: ${selectedService.duration}\nCurrent Weight: ${values.get('weight_kg')} kg\nHeight: ${values.get('height_cm')} cm\n\nTransformation Goal:\n${values.get('transformation_reason')}\n\nAdditional Message:\n${values.get('additional_message') || 'None'}\n\nCurrent Body Photo: ${photo?.name ? `${photo.name} (please attach it in WhatsApp)` : 'Not provided'}\n\nI agree to share my details for fitness consultation and follow-up. Please contact me about the next steps.\n\nThank you.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const submittedAt = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const params = {
      full_name: values.get('full_name'),
      name: values.get('full_name'),
      email: values.get('email'),
      to_email: values.get('email'),
      customer_email: values.get('email'),
      phone_number: values.get('phone_number'),
      age: values.get('age'),
      gender: values.get('gender'),
      height_cm: values.get('height_cm'),
      weight_kg: values.get('weight_kg'),
      fitness_goal: selectedService.title,
      selected_service: selectedService.title,
      selected_package: `${selectedService.title} · ${selectedService.duration}`,
      program_duration: selectedService.duration,
      preferred_workout_time: values.get('preferred_workout_time'),
      transformation_reason: values.get('transformation_reason'),
      additional_message: values.get('additional_message') || 'None',
      photo_filename: photo?.name || 'Not provided',
      submission_date: submittedAt,
      brand_name: 'KAVRO',
      tagline: 'Train Strong. Live Better.',
      contact_phone: '+91 88922 20980',
    };
    const signature = JSON.stringify(params);
    if (!deliveryRef.current || deliveryRef.current.signature !== signature) {
      deliveryRef.current = { signature, params, adminSent: false, customerSent: false };
    }

    submittingRef.current = true;
    setSending(true);
    setEmailError('');
    setWhatsappUrl(url);
    if (!deliveryRef.current.whatsappOpened) {
      const whatsappWindow = window.open(url, '_blank');
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        deliveryRef.current.whatsappOpened = true;
      }
    }
    try {
      const result = await sendEnquiryNotifications(deliveryRef.current.params, deliveryRef.current);
      deliveryRef.current.adminSent = result.adminSent;
      deliveryRef.current.customerSent = result.customerSent;
      if (!result.success) {
        if (result.adminSent || result.customerSent) {
          const delivered = [result.adminSent && 'admin notification', result.customerSent && 'customer confirmation'].filter(Boolean).join(' and ');
          const failed = [!result.adminSent && `admin: ${result.admin.error}`, !result.customerSent && `customer: ${result.customer.error}`].filter(Boolean).join('; ');
          setEmailError(`The ${delivered} email was sent, but another email failed (${failed}). Try again; the successful email will not be resent.`);
        } else {
          setEmailError(`We couldn’t send the enquiry emails. Admin notification: ${result.admin.error} Customer confirmation: ${result.customer.error} Your form details are still here; please try again.`);
        }
        return;
      }
      setSubmitted(true);
      form.reset();
    } catch (error) {
      setEmailError(error?.message || 'Email delivery failed. Check your connection and try again.');
    } finally {
      submittingRef.current = false;
      setSending(false);
    }
  }

  return (
    <>
      <main>
        <section className="values-strip" id="about">
          <div className="values-intro"><span>THE KAVRO METHOD</span><p>Five principles.<br />One stronger you.</p></div>
          {values.map(([letter, title, text]) => <div className="value-item" key={letter}><span className="value-letter">{letter}</span><div><strong>{title}</strong><small>{text}</small></div></div>)}
        </section>

        <section className="services section-wrap" id="services">
          <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> OUR PROGRAMS</p><h2>Choose your <em>goal.</em></h2></div><p className="section-aside">Select a program to tell us about yourself. We’ll open WhatsApp with your details and selected service ready to send.</p></div>
          <div className="service-grid">{services.map((service) => <button type="button" className="service-card" key={service.id} onClick={() => { setSelectedService(service); setSubmitted(false); setWhatsappUrl(''); setEmailError(''); deliveryRef.current = null; }} aria-label={`Select ${service.title}`}><span className="service-photo" style={{ backgroundImage: `url("${service.image}")` }} role="img" aria-label={`${service.title} fitness program`}><span className="service-number">{service.number}</span></span><span className="service-copy"><strong>{service.title} · {service.duration}</strong><span>{service.text}</span><span className="service-select">Select &amp; enquire <i>→</i></span></span></button>)}</div>
        </section>

        {selectedService && <div className="enquiry-modal" role="dialog" aria-modal="true" aria-label={`Enquiry for ${selectedService.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedService(null); }}><div className="enquiry-sheet"><button type="button" className="enquiry-close" onClick={() => setSelectedService(null)} aria-label="Close enquiry">×</button>{submitted ? <div className="enquiry-success" role="status"><div className="success-mark">✓</div><p className="eyebrow">EMAILS SENT</p><h3>Your enquiry is on its way.</h3><p>KAVRO has received your enquiry and a confirmation was sent to your email. WhatsApp is ready with your details; press Send there to message the trainer.</p><a className="button button-dark" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Continue to WhatsApp <span>↗</span></a><button className="text-link modal-back" type="button" onClick={() => setSubmitted(false)}>Back to form</button></div> : <><div className="form-heading"><div><span className="form-kicker">KAVRO / PROGRAM ENQUIRY</span><h3>Tell us about yourself</h3></div><span className="required-note">* REQUIRED</span></div><div className="selected-program"><span>SELECTED SERVICE</span><strong>{selectedService.title} · {selectedService.duration}</strong></div><form onSubmit={handleSubmit}><div className="form-grid"><label>Full name <span>*</span><input name="full_name" type="text" placeholder="Your full name" autoComplete="name" minLength="2" maxLength="120" required /></label><label>Email address <span>*</span><input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength="254" required /></label><label>Age <span>*</span><input name="age" type="number" placeholder="e.g. 28" min="10" max="90" required /></label><label>Phone number <span>*</span><input name="phone_number" type="tel" placeholder="+91 98765 43210" autoComplete="tel" pattern="\+?[0-9\s()\-]{7,18}" required /></label><label>Country <span>*</span><input name="country" type="text" autoComplete="country-name" defaultValue="India" required /></label><label>City <span>*</span><input name="city" type="text" placeholder="Your city" autoComplete="address-level2" required /></label><label>Gender <span>*</span><select name="gender" defaultValue="" required><option value="" disabled>Select an option</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select></label><label>Current weight (kg) <span>*</span><input name="weight_kg" type="number" step="0.1" placeholder="e.g. 68" min="20" max="300" required /></label><label>Height (cm) <span>*</span><input name="height_cm" type="number" step="0.1" placeholder="e.g. 172" min="100" max="250" required /></label><label>Preferred workout time <span>*</span><select name="preferred_workout_time" defaultValue="" required><option value="" disabled>Select a time</option><option>Early morning (5–8 AM)</option><option>Morning (8–12 PM)</option><option>Afternoon (12–4 PM)</option><option>Evening (4–8 PM)</option><option>Flexible</option></select></label><label className="full-field">Fitness goal <span>*</span><textarea name="transformation_reason" rows="3" placeholder="Share your goals, challenges, and what you hope to achieve." minLength="10" maxLength="2000" required /></label><label className="full-field">Additional message <small>(optional)</small><textarea name="additional_message" rows="3" placeholder="Anything else you would like your coach to know?" maxLength="2000" /></label><label className="full-field upload-label">Current body photo <small>(optional; attach it in WhatsApp after the message opens)</small><span className="upload-control"><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" /><span className="upload-symbol">＋</span><span>Choose a JPG, PNG, or WebP image</span><small>Optional</small></span></label></div><label className="honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex="-1" autoComplete="off" /></label><label className="consent"><input type="checkbox" name="consent_given" required /><span>I agree to share my information with a KAVRO coach for fitness consultation and follow-up. <b>*</b></span></label>{emailError && <div className="email-error" role="alert"><span>{emailError}</span>{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp with this enquiry ↗</a>}</div>}<button type="submit" className="button button-dark submit-button" disabled={sending}>{sending ? <><span className="email-spinner" /> Sending enquiry…</> : <>Send enquiry &amp; continue to WhatsApp <span>↗</span></>}</button><p className="submit-note">We’ll email KAVRO and send you a confirmation. WhatsApp opens with a prepared message; press Send there to contact the trainer.</p></form></>}</div></div>}
      </main>

      <footer className="site-footer"><a className="brand" href="#about"><span className="brand-mark">K</span><span>KAVRO<span className="brand-period">.</span></span></a><span>KNOWLEDGE · ACTION · VITALITY · RESULTS · OPTIMIZATION</span><a href="#about">BACK TO TOP ↑</a></footer>
    </>
  );
}
