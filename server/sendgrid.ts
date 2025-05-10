import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text: string; // Make text required instead of optional
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const email: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text
    };
    
    if (params.html) {
      email.html = params.html;
    }
    
    await mailService.send(email);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}