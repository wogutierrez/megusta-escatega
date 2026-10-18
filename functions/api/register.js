export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email || !phone) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate random pseudonym (e.g. SilverFalcon42)
    const ADJECTIVES = ['Silent', 'Silver', 'Rustic', 'Golden', 'Cosmic', 'Velvet', 'Lunar', 'Nimble', 'Noble', 'Brave'];
    const ANIMALS = ['Panda', 'Falcon', 'Owl', 'Jaguar', 'Otter', 'Fox', 'Eagle', 'Badger', 'Dolphin', 'Lynx'];
    const pseudonym = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]}${Math.floor(10 + Math.random() * 89)}`;

    // Save user into D1 database
    try {
      await env.DB.prepare(
        "INSERT INTO users (first_name, last_name, email, phone, pseudonym) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(firstName, lastName, email, phone, pseudonym)
        .run();
    } catch (dbErr) {
      // If email already exists, retrieve existing user handle instead of failing
      const existing = await env.DB.prepare("SELECT pseudonym FROM users WHERE email = ?").bind(email).first();
      if (existing) {
        return new Response(JSON.stringify({ success: true, pseudonym: existing.pseudonym }));
      }
      throw dbErr;
    }

    // Send Registration Email Notifications via Mailtrap
    if (env.MAILTRAP_API_KEY) {
      const apiKey = env.MAILTRAP_API_KEY.trim();

      // 1. Admin Alert to info@escatega.com
      await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: { email: "info@escatega.com", name: "Megusta Network" },
          to: [{ email: "info@escatega.com" }],
          subject: `New User Registration: ${firstName} ${lastName} [${pseudonym}]`,
          text: `A new user has registered on megusta.escatega.com!\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nAssigned Pseudonym: ${pseudonym}`
        })
      });

      // 2. Welcome Confirmation to the New User
      await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: { email: "info@escatega.com", name: "Megusta Network" },
          to: [{ email: email }],
          subject: `Welcome to Megusta Consignment Network`,
          text: `Hello ${firstName},\n\nYour registration was successful!\n\nYour private bidding handle is: [${pseudonym}]\n\nUse this handle when placing bids across the catalog while keeping your real identity private.\n\nThank you for joining!`
        })
      });
    }

    return new Response(
      JSON.stringify({ success: true, pseudonym }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}