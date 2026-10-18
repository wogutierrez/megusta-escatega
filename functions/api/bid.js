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

    // 2. Return success with user pseudonym for local state update (No emails sent on bid)
    return new Response(
      JSON.stringify({
        success: true,
        pseudonym: user.pseudonym,
        message: "Bid recorded successfully."
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}