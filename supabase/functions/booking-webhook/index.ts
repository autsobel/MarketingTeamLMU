/**
 * booking-webhook — Supabase Edge Function
 * Triggered client-side after a successful booking insert.
 *
 * Handles:
 *   1. Sends confirmation email to the guest
 *   2. Sends internal notification email to the business owner
 *   3. Creates/updates HubSpot contact + deal
 *
 * Deploy: supabase functions deploy booking-webhook
 * Docs:   https://supabase.com/docs/guides/functions
 *
 * Environment secrets (set via Supabase Dashboard → Functions → Secrets):
 *   SUPABASE_SERVICE_ROLE_KEY
 *   HUBSPOT_API_KEY
 *   EMAIL_SERVICE_API_KEY
 *   EMAIL_PROVIDER       ('resend' | 'sendgrid' | 'postmark')
 *   EMAIL_FROM
 *   INTERNAL_NOTIFY_EMAIL
 */

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const HUBSPOT_API_KEY   = Deno.env.get('HUBSPOT_API_KEY')!;
const EMAIL_API_KEY     = Deno.env.get('EMAIL_SERVICE_API_KEY')!;
const EMAIL_PROVIDER    = Deno.env.get('EMAIL_PROVIDER') || 'resend';
const EMAIL_FROM        = Deno.env.get('EMAIL_FROM') || 'hello@lightmeupbonfires.com';
const INTERNAL_EMAIL    = Deno.env.get('INTERNAL_NOTIFY_EMAIL') || 'hello@lightmeupbonfires.com';

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE);

// ============================================================
// HUBSPOT CRM
// ============================================================
async function upsertHubSpotContact(name: string, email: string, phone: string) {
  const firstName = name.split(' ')[0] || name;
  const lastName  = name.split(' ').slice(1).join(' ') || '';

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      properties: {
        email:      email,
        firstname:  firstName,
        lastname:   lastName,
        phone:      phone,
        hs_lead_status: 'NEW'
      }
    })
  });

  // 409 = contact already exists — find and update
  if (res.status === 409) {
    const searchRes = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`
        },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }]
        })
      }
    );
    const searchData = await searchRes.json();
    return searchData?.results?.[0]?.id || null;
  }

  const data = await res.json();
  return data?.id || null;
}

async function createHubSpotDeal(
  contactId: string,
  booking: Record<string, unknown>
) {
  const addOnsStr = Array.isArray(booking.add_ons)
    ? (booking.add_ons as {name:string}[]).map(a => a.name).join(', ')
    : '';

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${HUBSPOT_API_KEY}`
    },
    body: JSON.stringify({
      properties: {
        dealname:     `LMU Booking — ${booking.name} (${booking.package_type || 'inquiry'})`,
        dealstage:    'appointmentscheduled', // "New Inquiry" stage — TODO: confirm pipeline stage ID
        pipeline:     'default',              // TODO: update with your pipeline ID if not default
        closedate:    booking.preferred_date_1,
        description:  [
          `Beach Preference 1: ${booking.beach_access_preference_1 || 'TBD'}`,
          `Beach Preference 2: ${booking.beach_access_preference_2 || 'TBD'}`,
          `Beach Preference 3: ${booking.beach_access_preference_3 || 'TBD'}`,
          `Beach Area: ${booking.beach_area_selected || 'Address mode'}`,
          `Zone: ${booking.location_zone || 'TBD'}`,
          `Package: ${booking.selected_package || 'TBD'}`,
          `Guests: ${booking.guest_count || 'TBD'}`,
          // DATE_AVAILABILITY_PHASE_2: preferred_date_1 / preferred_date_2 lines go here
          `Add-ons: ${addOnsStr || 'None'}`,
          `Rental Address: ${booking.rental_address || 'N/A'}`,
          `Notes: ${booking.notes || 'None'}`
        ].join('\n'),
        lmu_package_type:       booking.package_type as string,
        lmu_location_zone:      booking.location_zone as string,
        lmu_beach_access:       booking.beach_access_preference_1 as string,
        lmu_booking_status:     'pending_contact'
        // PAYMENT_PHASE_2: add deposit amount, Stripe charge ID here
      },
      associations: [{
        to:   { id: contactId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
      }]
    })
  });
  const data = await res.json();
  return data?.id || null;
}

// ============================================================
// EMAIL
// ============================================================
async function sendEmail(to: string, subject: string, html: string) {
  if (EMAIL_PROVIDER === 'resend') {
    await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_API_KEY}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html })
    });
  } else if (EMAIL_PROVIDER === 'sendgrid') {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_API_KEY}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from:    { email: EMAIL_FROM },
        subject: subject,
        content: [{ type: 'text/html', value: html }]
      })
    });
  }
  // TODO: add postmark or other providers here
}

// COPY_PLACEHOLDER: Update the email copy below with final marketing language.
function guestConfirmationHtml(booking: Record<string, unknown>): string {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2228;">
      <div style="background:#C8562A;padding:32px 28px;text-align:center;">
        <h1 style="color:#fff;font-size:28px;margin:0;">Light Me Up Beach Bonfires</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-style:italic;">Your night on the beach is confirmed!</p>
      </div>
      <div style="padding:36px 28px;">
        <p style="font-size:18px;">Hi ${booking.name},</p>
        <p style="line-height:1.8;">
          Thank you for your booking request! A team member will reach out within 24 hours
          to confirm your date and provide pricing details.
        </p>
        <!-- COPY_PLACEHOLDER: Add warm brand copy here -->
        <div style="background:#FAF5EC;border-radius:12px;padding:22px;margin:28px 0;">
          <h3 style="color:#C8562A;margin:0 0 14px;">Your Booking Details</h3>
          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>Location:</strong> ${booking.beach_access_location || 'TBD'}</p>
          <p><strong>Preferred Dates:</strong> ${booking.preferred_date_1} &mdash; ${booking.preferred_date_2 || 'TBD'}</p>
          <p><strong>Guests:</strong> ${booking.guest_count}</p>
          <p><strong>Package Type:</strong> ${booking.package_type}</p>
        </div>
        <p style="font-style:italic;color:#8A9098;">Love, The LMU Team</p>
      </div>
    </div>
  `;
}

function internalNotificationHtml(booking: Record<string, unknown>): string {
  return `
    <div style="font-family:monospace;max-width:700px;margin:0 auto;">
      <h2>New Booking Request — LMU</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:6px;border:1px solid #ddd;">${booking.name}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:6px;border:1px solid #ddd;">${booking.email}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:6px;border:1px solid #ddd;">${booking.phone}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Rental Address</td><td style="padding:6px;border:1px solid #ddd;">${booking.rental_address || 'N/A'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Beach Area</td><td style="padding:6px;border:1px solid #ddd;">${booking.beach_area_selected || 'Address mode'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Preference 1</td><td style="padding:6px;border:1px solid #ddd;">${booking.beach_access_preference_1 || 'TBD'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Preference 2</td><td style="padding:6px;border:1px solid #ddd;">${booking.beach_access_preference_2 || 'TBD'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Preference 3</td><td style="padding:6px;border:1px solid #ddd;">${booking.beach_access_preference_3 || 'TBD'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Zone</td><td style="padding:6px;border:1px solid #ddd;">${booking.location_zone}</td></tr>
        <!-- DATE_AVAILABILITY_PHASE_2: date rows go here -->
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Guests</td><td style="padding:6px;border:1px solid #ddd;">${booking.guest_count}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Package Type</td><td style="padding:6px;border:1px solid #ddd;">${booking.package_type}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Selected Package</td><td style="padding:6px;border:1px solid #ddd;">${booking.selected_package || 'TBD'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Add-ons</td><td style="padding:6px;border:1px solid #ddd;">${JSON.stringify(booking.add_ons)}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold;">Notes</td><td style="padding:6px;border:1px solid #ddd;">${booking.notes || 'None'}</td></tr>
      </table>
    </div>
  `;
}

// ============================================================
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body: { booking_id: string; booking_type: string };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { booking_id, booking_type } = body;
  if (!booking_id) {
    return new Response('Missing booking_id', { status: 400 });
  }

  // Fetch the full booking record
  const table = booking_type === 'social_fire' ? 'social_fire_bookings' : 'bookings';
  const { data: booking, error } = await sb
    .from(table)
    .select('*')
    .eq('id', booking_id)
    .single();

  if (error || !booking) {
    return new Response('Booking not found', { status: 404 });
  }

  const guestEmail = booking.email || booking.primary_guest_email;
  const guestName  = booking.name  || booking.primary_guest_name;

  const results: string[] = [];

  // 1. Guest confirmation email
  try {
    await sendEmail(
      guestEmail,
      'Your LMU Beach Bonfire Request is Confirmed!',
      guestConfirmationHtml(booking)
    );
    results.push('email_guest:ok');
  } catch (e) {
    results.push('email_guest:failed');
    console.error('Guest email failed:', e);
  }

  // 2. Internal notification
  try {
    await sendEmail(
      INTERNAL_EMAIL,
      `New ${booking_type || 'bonfire'} Booking — ${guestName}`,
      internalNotificationHtml(booking)
    );
    results.push('email_internal:ok');
  } catch (e) {
    results.push('email_internal:failed');
    console.error('Internal email failed:', e);
  }

  // 3. HubSpot CRM
  try {
    const contactId = await upsertHubSpotContact(guestName, guestEmail, booking.phone || booking.primary_guest_phone);
    if (contactId) {
      const dealId = await createHubSpotDeal(contactId, booking);
      // Save IDs back to the booking row
      await sb.from(table).update({
        hubspot_contact_id: contactId,
        hubspot_deal_id:    dealId
      }).eq('id', booking_id);
      results.push('hubspot:ok');
    }
  } catch (e) {
    results.push('hubspot:failed');
    console.error('HubSpot sync failed:', e);
  }

  // PAYMENT_PHASE_2: Stripe payment intent creation/verification goes here

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
