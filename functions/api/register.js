// Random Pseudonym Generator for Privacy
const ADJECTIVES = ['Silent', 'Silver', 'Rustic', 'Golden', 'Cosmic', 'Velvet', 'Lunar', 'Nimble', 'Noble', 'Brave'];
const ANIMALS = ['Panda', 'Falcon', 'Owl', 'Jaguar', 'Otter', 'Fox', 'Eagle', 'Badger', 'Dolphin', 'Lynx'];

const generatePseudonym = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${adj}${animal}${num}`;
};

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email || !phone) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if user is already registered
    const existing = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (existing) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Welcome back! You are already registered.", 
        pseudonym: existing.pseudonym 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Generate unique private handle
    const pseudonym = generatePseudonym();

    // Store in Cloudflare D1 Database
    await env.DB.prepare(
      "INSERT INTO users (first_name, last_name, email, phone, pseudonym) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(firstName, lastName, email, phone, pseudonym)
    .run();

    return new Response(JSON.stringify({ 
      success: true, 
      pseudonym,
      message: "Registration successful!" 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}