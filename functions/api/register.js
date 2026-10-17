export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email || !phone) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Check if email already exists
    const existing = await env.DB.prepare("SELECT email FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (existing) {
      return new Response(JSON.stringify({ error: "Email is already registered. Use Sign In instead." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Generate unique private handle
    const ADJECTIVES = ['Silent', 'Silver', 'Rustic', 'Golden', 'Cosmic', 'Velvet', 'Lunar', 'Nimble', 'Noble', 'Brave'];
    const ANIMALS = ['Panda', 'Falcon', 'Owl', 'Jaguar', 'Otter', 'Fox', 'Eagle', 'Badger', 'Dolphin', 'Lynx'];
    const pseudonym = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]}${Math.floor(10 + Math.random() * 89)}`;

    // Insert user into D1 database
    await env.DB.prepare(
      "INSERT INTO users (first_name, last_name, email, phone, pseudonym) VALUES (?, ?, ?, ?, ?)"
    ).bind(firstName, lastName, email, phone, pseudonym).run();

    // Send email via Mailtrap API using verified domain email
    if (env.MAILTRAP_API_KEY) {
      const mailtrapRes = await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.MAILTRAP_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: "info@escatega.com", name: "Megusta Network" },
          to: [{ email: "info@escatega.com" }, { email: email }],
          subject: `New User Registration: [${pseudonym}]`,
          text: `A new user has registered on megusta.escatega.com:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nPseudonym Handle: ${pseudonym}`
        })
      });

      const mailtrapData = await mailtrapRes.json().catch(() => ({}));

      if (!mailtrapRes.ok) {
        return new Response(JSON.stringify({ 
          success: true, 
          pseudonym, 
          emailWarning: mailtrapData.errors || mailtrapData.message || "Email dispatch failed" 
        }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
      }
    }

    return new Response(JSON.stringify({ success: true, pseudonym }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}