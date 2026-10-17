export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { email, itemId, itemTitle, bidAmount } = body;

    if (!email || !itemId || !bidAmount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Find bidder in D1 database
    const user = await env.DB.prepare(
      "SELECT first_name, last_name, email, phone, pseudonym FROM users WHERE email = ?"
    )
      .bind(email)
      .first();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User profile not found. Please register first." }), 
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Dispatch Emails via Mailtrap API
    if (env.MAILTRAP_API_KEY) {
      const apiKey = env.MAILTRAP_API_KEY.trim();

      // Email A: Admin Alert (to info@escatega.com)
      const adminEmailPromise = fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: "info@escatega.com", name: "Megusta Network" },
          to: [{ email: "info@escatega.com" }],
          subject: `New Bid Alert: $${bidAmount} on ${itemTitle || 'Item #' + itemId}`,
          text: `A new bid has been placed on megusta.escatega.com!\n\nItem: ${itemTitle || itemId}\nBid Amount: $${bidAmount} USD\n\nBidder Details:\n- Pseudonym: ${user.pseudonym}\n- Full Name: ${user.first_name} ${user.last_name}\n- Email: ${user.email}\n- Phone: ${user.phone}`
        })
      });

      // Email B: Bidder Confirmation (to the user who placed the bid)
      const userEmailPromise = fetch("https://send.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: { email: "info@escatega.com", name: "Megusta Network" },
          to: [{ email: user.email }],
          subject: `Bid Confirmation: $${bidAmount} on ${itemTitle || 'Item #' + itemId}`,
          text: `Hello ${user.first_name},\n\nYour bid of $${bidAmount} USD on "${itemTitle || itemId}" has been received successfully.\n\nYour public bidding handle is: [${user.pseudonym}]\n\nThank you for participating on Megusta!`
        })
      });

      // Execute both email dispatches in parallel
      const [adminRes, userRes] = await Promise.all([adminEmailPromise, userEmailPromise]);

      const adminData = await adminRes.json().catch(() => ({}));
      const userData = await userRes.json().catch(() => ({}));

      return new Response(
        JSON.stringify({
          success: true,
          pseudonym: user.pseudonym,
          adminEmailStatus: adminRes.status,
          userEmailStatus: userRes.status,
          adminData,
          userData
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, pseudonym: user.pseudonym }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}