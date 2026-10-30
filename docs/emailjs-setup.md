# EmailJS setup for KAVRO

KAVRO sends one administrator notification and one customer confirmation when an enquiry form is submitted. Create both EmailJS templates below, attach each to the EmailJS service, and set their IDs as environment variables. Appointment confirmation is not implemented because the site does not book appointments.

## Environment values

Copy `.env.example` to `.env.local` for local development and fill in the two template IDs and public key. The service ID and public key supplied for this project are already present in the local `.env.local`; keep that file out of source control. Never put the EmailJS private key in this React project.

Set these GitHub repository secrets for Pages builds:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID` (administrator notification)
- `VITE_EMAILJS_WELCOME_TEMPLATE_ID` (customer confirmation)
- `VITE_EMAILJS_PUBLIC_KEY`

The welcome template ID is an additional secret because the admin and customer messages use separate templates.
For the templates shown in your dashboard, set `VITE_EMAILJS_TEMPLATE_ID` to `template_jr4003x` (Contact Us) and `VITE_EMAILJS_WELCOME_TEMPLATE_ID` to `template_pdk123o` (Auto-Reply). Set the service ID and public key to the same values used in `.env.local`.

## Template 1: Admin notification

Create an EmailJS template and configure its recipient as the KAVRO administrator's fixed email address in the EmailJS dashboard. Set Reply-To to `{{email}}`. Do not take the recipient address from a form field.

**Subject:** `New KAVRO enquiry: {{full_name}} — {{selected_service}}`

Paste this responsive HTML into the template:

```html
<div style="margin:0;background:#f5f4ef;padding:28px 12px;font-family:Arial,sans-serif;color:#20211d">
  <div style="max-width:620px;margin:auto;background:#fff;border:1px solid #e3e3db">
    <div style="padding:24px 28px;background:#20211d;color:#fff">
      <div style="font-size:22px;font-weight:700;letter-spacing:2px">KAVRO<span style="color:#d4fa67">.</span></div>
      <div style="margin-top:6px;color:#d4fa67;font-size:12px">Train Strong. Live Better.</div>
    </div>
    <div style="padding:26px 28px">
      <p style="margin:0 0 7px;color:#84984b;font-size:11px;font-weight:bold;letter-spacing:1px">NEW CUSTOMER ENQUIRY</p>
      <h1 style="margin:0 0 20px;font-size:23px">{{full_name}}</h1>
      <p style="line-height:1.6">A customer has submitted a fitness coaching enquiry.</p>
      <h2 style="font-size:15px;border-bottom:1px solid #e5e5dd;padding-bottom:8px">Customer details</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
        <tr><td style="padding:5px;color:#777">Email</td><td>{{email}}</td></tr>
        <tr><td style="padding:5px;color:#777">Phone</td><td>{{phone_number}}</td></tr>
        <tr><td style="padding:5px;color:#777">Age / Gender</td><td>{{age}} / {{gender}}</td></tr>
        <tr><td style="padding:5px;color:#777">Height / Weight</td><td>{{height_cm}} cm / {{weight_kg}} kg</td></tr>
        <tr><td style="padding:5px;color:#777">City / Country</td><td>{{city}}, {{country}}</td></tr>
        <tr><td style="padding:5px;color:#777">Workout time</td><td>{{preferred_workout_time}}</td></tr>
        <tr><td style="padding:5px;color:#777">Service</td><td>{{selected_service}}</td></tr>
        <tr><td style="padding:5px;color:#777">Package</td><td>{{selected_package}}</td></tr>
        <tr><td style="padding:5px;color:#777">Submitted</td><td>{{submission_date}}</td></tr>
      </table>
      <h2 style="font-size:15px;border-bottom:1px solid #e5e5dd;padding-bottom:8px;margin-top:24px">Fitness goal</h2>
      <p style="white-space:pre-wrap;line-height:1.65">{{transformation_reason}}</p>
      <h2 style="font-size:15px;border-bottom:1px solid #e5e5dd;padding-bottom:8px;margin-top:24px">Additional message</h2>
      <p style="white-space:pre-wrap;line-height:1.65">{{additional_message}}</p>
      <p style="font-size:12px;color:#777">Photo selected: {{photo_filename}} (the customer will attach it in WhatsApp if needed).</p>
    </div>
    <div style="padding:17px 28px;background:#f5f4ef;color:#777;font-size:11px">KAVRO · Knowledge · Action · Vitality · Results · Optimization</div>
  </div>
</div>
```

## Template 2: Customer confirmation

Create a second template. Set **To Email** to `{{to_email}}`; use the connected service's verified sender address as **From Email**. Set Reply-To to the KAVRO contact address.

**Subject:** `We received your KAVRO enquiry, {{name}}`

Paste this responsive HTML into the template:

```html
<div style="margin:0;background:#f5f4ef;padding:28px 12px;font-family:Arial,sans-serif;color:#20211d">
  <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e3e3db">
    <div style="padding:24px 28px;background:#20211d;color:#fff">
      <div style="font-size:22px;font-weight:700;letter-spacing:2px">KAVRO<span style="color:#d4fa67">.</span></div>
      <div style="margin-top:6px;color:#d4fa67;font-size:12px">Train Strong. Live Better.</div>
    </div>
    <div style="padding:30px 28px">
      <p style="margin:0 0 8px;color:#84984b;font-size:11px;font-weight:bold;letter-spacing:1px">ENQUIRY RECEIVED</p>
      <h1 style="margin:0 0 16px;font-size:25px">Thanks, {{name}}.</h1>
      <p style="font-size:15px;line-height:1.7">We’ve received your enquiry about <strong>{{selected_service}}</strong> ({{program_duration}}). A KAVRO trainer will contact you to discuss your goals and next steps.</p>
      <div style="margin:22px 0;padding:16px;background:#f1f2e9;border-left:3px solid #b4ce62">
        <div style="font-size:11px;color:#777;letter-spacing:1px">YOUR PREFERRED WORKOUT TIME</div>
        <div style="margin-top:5px;font-weight:bold">{{preferred_workout_time}}</div>
      </div>
      <p style="font-size:14px;line-height:1.7">Questions? Reply to this email or contact KAVRO at <a href="tel:{{contact_phone}}" style="color:#087f73">{{contact_phone}}</a>.</p>
      <p style="margin-top:26px;font-size:14px">Keep moving,<br /><strong>The KAVRO Team</strong></p>
    </div>
    <div style="padding:17px 28px;background:#f5f4ef;color:#777;font-size:11px">KAVRO · Knowledge · Action · Vitality · Results · Optimization</div>
  </div>
</div>
```

## Template variables

The app passes these variables to both templates; use the subset shown in each template:

`full_name`, `name`, `email`, `to_email`, `customer_email`, `phone_number`, `age`, `gender`, `height_cm`, `weight_kg`, `fitness_goal`, `selected_service`, `selected_package`, `program_duration`, `preferred_workout_time`, `transformation_reason`, `additional_message`, `photo_filename`, `submission_date`, `brand_name`, `tagline`, `contact_phone`.

EmailJS uses double curly-brace placeholders such as `{{full_name}}`. Configure the admin recipient as a fixed destination in its template. The customer template alone uses the validated address submitted by the customer as `{{to_email}}`.

## Local test and Pages deployment

1. Create both templates and send test messages from the EmailJS dashboard.
2. Fill `.env.local` with the service ID, admin template ID, customer welcome template ID, and public key.
3. Run `npm run dev`, submit the form with an address you can access, verify both emails, then verify the WhatsApp message is populated.
4. Add the four GitHub repository secrets listed above. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
5. Push to the `main` branch or run the **Deploy KAVRO to GitHub Pages** workflow manually.

The private key is not used by the browser SDK. Rotate it in EmailJS because it was shared in the project request. Restrict EmailJS allowed domains to the production GitHub Pages domain and local development domain, retain the SDK throttling and honeypot checks, and enable CAPTCHA in EmailJS templates/account settings if available for your plan. Client validation and the honeypot are not a complete spam defense.
