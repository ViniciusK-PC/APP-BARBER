type VerificationEmailInput = {
  name: string;
  email: string;
  verificationUrl: string;
};

const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const senderName = process.env.BREVO_SENDER_NAME || "Developer Barber";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendVerificationEmail({ name, email, verificationUrl }: VerificationEmailInput) {
  if (!brevoApiKey || !senderEmail) {
    console.warn("[email] Brevo não configurado. Link de verificação:", verificationUrl);
    return { sent: false, reason: "BREVO_NOT_CONFIGURED" as const };
  }

  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(verificationUrl);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email, name }],
      subject: "Confirme seu e-mail!",
      htmlContent: `
        <div style="margin:0;background:#f6f6f6;padding:0 12px 28px;font-family:Arial,Helvetica,sans-serif;color:#111111">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;text-align:center;padding:28px 42px 20px">
            <div style="display:inline-block;margin:0 auto 20px;padding:7px 20px;border:2px solid #062f4b;border-radius:8px;color:#062f4b;font-size:18px;font-weight:700;letter-spacing:.2px">
              ✂ MEU BARBER
            </div>
            <div style="border-top:4px dashed #062f4b;padding-top:25px">
              <h1 style="margin:0 0 32px;font-size:36px;line-height:1.1;color:#111111">Confirme seu E-mail</h1>
              <p style="margin:0 auto 20px;max-width:510px;font-size:13px;line-height:1.55">
                Olá, ${safeName}. Você recebeu esta mensagem porque o seu e-mail foi cadastrado no Meu Barber.
                Clique no botão abaixo para verificar o seu e-mail e confirmar que você é o dono dessa conta.
              </p>
              <p style="margin:0 0 18px;font-size:13px;line-height:1.5">
                Caso você não tenha feito esse cadastro, por favor desconsidere este e-mail.
              </p>
              <a href="${safeUrl}" style="display:block;max-width:330px;margin:0 auto 14px;background:#062f4b;color:#ffffff;text-decoration:none;font-size:18px;line-height:44px;border-radius:5px">
                CONFIRMAR MEU EMAIL
              </a>
              <p style="margin:0 0 22px;font-size:12px">Quando confirmado, esse e-mail será vinculado à sua conta.</p>
            </div>
            <div style="border-top:4px dashed #062f4b;padding-top:14px">
              <p style="margin:0;font-size:11px;color:#555555">
                Esta é uma mensagem automática de confirmação enviada pelo Meu Barber.
              </p>
            </div>
          </div>
        </div>
      `
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Falha ao enviar e-mail pelo Brevo (${response.status}): ${details}`);
  }

  return { sent: true as const };
}
