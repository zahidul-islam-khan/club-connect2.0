# Club Connect - BRAC University Club Management System

A comprehensive web application for managing student clubs and societies at BRAC University. Built with Next.js, TypeScript, TailwindCSS, PostgreSQL, Prisma, NextAuth.js, and Resend.

## 🏗️ Architecture & Modules

### Module 1: Student Portal
- **Student Registration & Login**: Secure authentication system
- **Student Dashboard**: Personalized dashboard with club memberships and events
- **Club Discovery**: Browse and search active clubs by category/interests
- **Membership Applications**: Apply to join clubs with application tracking
- **Event RSVP**: View and RSVP to club events
- **Profile Management**: Update personal information and preferences

### Module 2: Club Management
- **Club Profile Management**: Edit club information, logo, and details
- **Membership Management**: Review and approve/reject membership applications
- **Member Role Management**: Assign roles to club members
- **Event Creation & Management**: Create, update, and manage club events
- **Club Notifications**: Send announcements and updates to members
- **Member Communication**: Direct messaging and notifications

### Module 3: Admin Panel (OCA)
- **User Management**: Oversee all registered students and club leaders
- **Club Registration**: Approve new club registrations and manage existing clubs
- **Event Approval**: Review and approve/reject club event proposals
- **Budget Management**: Handle club budget requests and approvals
- **System Analytics**: View platform usage statistics and reports
- **Mass Communication**: Send university-wide announcements

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Email Service**: Resend
- **UI Components**: Radix UI primitives
- **Deployment**: Vercel (production)

## 🔐 User Roles & Permissions

| Role | Access Level | Permissions |
|------|--------------|-------------|
| **Student** | Module 1 | View clubs, apply for membership, RSVP events, manage profile |
| **Club Leader** | Module 1 + 2 | All student features + club management, member management, event creation |
| **Admin/OCA** | Module 3 | Full system oversight, club approvals, budget management, system analytics |

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd club-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your variables:
```bash
cp .env.example .env
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clubconnect"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Resend Email
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@clubconnect.bracu.ac.bd"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Core Models
- **User**: Student profiles with role-based access
- **Club**: Club information and metadata
- **Membership**: Student-club relationships
- **Event**: Club events and activities
- **EventRsvp**: Event attendance tracking
- **BudgetRequest**: Club budget management
- **Notification**: System-wide messaging

### Key Relationships
- Users can be members of multiple clubs
- Clubs have one leader and multiple members
- Events belong to clubs and can have multiple RSVPs
- Budget requests are tied to clubs and require approval

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
- Set up PostgreSQL database (recommend: Supabase, Neon, or PlanetScale)
- Configure Resend API for email services
- Update NEXTAUTH_URL to your production domain

## 🧪 Development Guidelines

### Code Standards
- Use TypeScript interfaces for all data structures
- Implement proper error handling with try-catch blocks
- Follow Next.js 15 conventions with App Router
- Use server actions for data mutations
- Implement loading states and error boundaries

### Component Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives
│   └── forms/          # Form components
├── lib/                # Utility functions
├── types/              # TypeScript definitions
└── hooks/              # Custom React hooks
```

### Database Queries
- Use Prisma for all database operations
- Implement proper error handling for database queries
- Use transactions for complex operations
- Follow the principle of least privilege for data access

## 📧 Email Configuration

The system uses Resend for email notifications:

- **Welcome emails** for new user registrations
- **Club application notifications** for leaders
- **Event reminders** for registered participants
- **System announcements** from administrators

## 🔒 Security Features

- **Authentication**: Secure password hashing with bcrypt
- **Authorization**: Role-based access control
- **Session Management**: Secure JWT sessions with NextAuth.js
- **Data Validation**: Input validation with Zod schemas
- **CSRF Protection**: Built-in Next.js CSRF protection

## 🎯 Future Enhancements

- **Mobile App**: React Native mobile application
- **Real-time Chat**: WebSocket-based messaging system
- **File Upload**: Club document and image management
- **Calendar Integration**: Google Calendar sync for events
- **Payment Gateway**: Online fee collection for events
- **Analytics Dashboard**: Advanced reporting and insights

## 👥 Team Collaboration

### Git Workflow
1. Create feature branches from `main`
2. Use descriptive commit messages
3. Create pull requests for code review
4. Merge only after approval and testing

### Development Process
1. **Planning**: Break down features into smaller tasks
2. **Development**: Implement features with proper testing
3. **Testing**: Manual testing and validation
4. **Documentation**: Update README and code comments
5. **Deployment**: Deploy to staging before production

## 📞 Support & Contact

For technical support or questions about Club Connect:
- **Development Team**: [team-email@bracu.ac.bd]
- **OCA Office**: [oca@bracu.ac.bd]
- **GitHub Issues**: Use the repository's issue tracker

---

**Club Connect** - Empowering student organizations at BRAC University through technology.

Built with ❤️ by the BRAC University development team.
