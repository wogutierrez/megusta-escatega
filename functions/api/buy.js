export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { email, itemId, itemTitle, price } = body;

    if (!email || !itemId) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fetch user details from D1 database
    const user = await env.DB.prepare("SELECT first_name, last_name, email, phone, pseudonym FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ error: "User profile not found. Please register first." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Send email alert via Mailtrap API
    if (env.MAILTRAP_API_KEY) {
      await fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.MAILTRAP_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: "hello@escatega.com", name: "Megusta Network" },
          to: [{ email: "info@escatega.com" }, { email: user.email }],
          subject: `Instant Buy Request: ${itemTitle || 'Item'} ($${price})`,
          text: `An instant purchase request has been submitted!\n\nItem: ${itemTitle || itemId}\nPrice: $${price} USD\n\nBuyer Details:\n- Pseudonym: ${user.pseudonym}\n- Name: ${user.first_name} ${user.last_name}\n- Email: ${user.email}\n- Phone: ${user.phone}`
        })
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}