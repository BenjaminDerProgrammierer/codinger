export function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): void {
  // TODO: Implement email sending logic here. For now, just log emails to the console.
  console.log(`New email to ${to}: '${subject}'\n'${body}'`);
}
