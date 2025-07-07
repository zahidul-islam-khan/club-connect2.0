import { Resend } from 'resend'

// Initialize Resend with API key if available
let resend: Resend | null = null
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your-resend-api-key') {
  resend = new Resend(process.env.RESEND_API_KEY)
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'noreply@clubconnect.bracu.ac.bd',
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) => {
  // If Resend is not configured, log the email instead of sending
  if (!resend) {
    console.log('\n📧 Email would be sent (Resend not configured):')
    console.log(`To: ${Array.isArray(to) ? to.join(', ') : to}`)
    console.log(`Subject: ${subject}`)
    console.log(`From: ${from}`)
    console.log('---')
    return { id: 'mock-email-id', success: true }
  }

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
    return result
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

// Email templates
export const emailTemplates = {
  welcomeStudent: (name: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to Club Connect!</h1>
      <p>Dear ${name},</p>
      <p>Welcome to BRAC University's Club Connect platform! You can now discover and join clubs that match your interests.</p>
      <p>Get started by exploring our active clubs and upcoming events.</p>
      <p>Best regards,<br>Club Connect Team</p>
    </div>
  `,
  
  clubApplicationReceived: (studentName: string, clubName: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">New Club Application</h1>
      <p>A new membership application has been received:</p>
      <p><strong>Student:</strong> ${studentName}<br>
      <strong>Club:</strong> ${clubName}</p>
      <p>Please log in to your Club Management dashboard to review this application.</p>
      <p>Best regards,<br>Club Connect Team</p>
    </div>
  `,
  
  eventReminder: (eventTitle: string, eventDate: string, venue: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Event Reminder</h1>
      <p>Don't forget about the upcoming event you RSVP'd to:</p>
      <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2 style="margin: 0; color: #1f2937;">${eventTitle}</h2>
        <p style="margin: 10px 0;"><strong>Date:</strong> ${eventDate}</p>
        <p style="margin: 10px 0;"><strong>Venue:</strong> ${venue}</p>
      </div>
      <p>We look forward to seeing you there!</p>
      <p>Best regards,<br>Club Connect Team</p>
    </div>
  `,

  membershipApproved: (studentName: string, clubName: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
        </div>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear ${studentName},</p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          We're excited to inform you that your membership application to <strong style="color: #2563eb;">${clubName}</strong> has been <strong style="color: #059669;">approved</strong>!
        </p>
        
        <div style="background: #ecfdf5; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid #059669;">
          <p style="margin: 0; color: #065f46; font-weight: 600;">Welcome to ${clubName}!</p>
          <p style="margin: 10px 0 0 0; color: #065f46;">You are now an official member and can participate in all club activities and events.</p>
        </div>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          You can now access your membership dashboard, view upcoming events, and connect with fellow members. We encourage you to actively participate in club activities and make the most of this opportunity.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Visit Your Dashboard
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin: 0;">
          Best regards,<br>
          <strong>Club Connect Team</strong><br>
          BRAC University
        </p>
      </div>
    </div>
  `,

  membershipRejected: (studentName: string, clubName: string, reason?: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 28px;">Application Update</h1>
        </div>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear ${studentName},</p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Thank you for your interest in joining <strong style="color: #2563eb;">${clubName}</strong>. After careful consideration, we regret to inform you that your membership application has not been approved at this time.
        </p>
        
        ${reason ? `
          <div style="background: #fef2f2; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid #dc2626;">
            <p style="margin: 0; color: #991b1b; font-weight: 600;">Reason:</p>
            <p style="margin: 10px 0 0 0; color: #991b1b;">${reason}</p>
          </div>
        ` : ''}
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Please don't be discouraged! There are many other clubs at BRAC University that might be a perfect fit for your interests and goals. We encourage you to explore other opportunities and consider reapplying in the future.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/clubs" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Explore Other Clubs
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin: 0;">
          Best regards,<br>
          <strong>Club Connect Team</strong><br>
          BRAC University
        </p>
      </div>
    </div>
  `,

  clubLeaderNotification: (leaderName: string, studentName: string, studentId: string, clubName: string, department: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">📝 New Membership Application</h1>
        </div>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear ${leaderName},</p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          A new student has applied for membership to <strong style="color: #2563eb;">${clubName}</strong>. Please review their application details below:
        </p>
        
        <div style="background: #f3f4f6; padding: 25px; margin: 25px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">Applicant Details:</h3>
          <p style="margin: 8px 0; color: #374151;"><strong>Name:</strong> ${studentName}</p>
          <p style="margin: 8px 0; color: #374151;"><strong>Student ID:</strong> ${studentId}</p>
          <p style="margin: 8px 0; color: #374151;"><strong>Department:</strong> ${department}</p>
          <p style="margin: 8px 0; color: #374151;"><strong>Applied for:</strong> ${clubName}</p>
        </div>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Please log in to your club management dashboard to review this application and make a decision. You can approve or reject the application based on your club's criteria.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/club-leader/memberships" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Review Application
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin: 0;">
          Best regards,<br>
          <strong>Club Connect Team</strong><br>
          BRAC University
        </p>
      </div>
    </div>
  `,
}
