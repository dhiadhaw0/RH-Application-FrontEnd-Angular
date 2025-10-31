export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  RECRUITER = 'RECRUITER',
  CANDIDATE = 'CANDIDATE',
  AI_ANALYST = 'AI_ANALYST'
}

export interface User {
  id: number;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth: string | Date;
  createdAt: string | Date;
  lastLogin?: string | Date;
  isMentor: boolean;
  mentorBio?: string;
  mentorExpertise?: string;
  banned: boolean;
  isModerator: boolean;
  expertise?: string;
  languages?: string;
  availability?: string;
  linkedinUrl?: string;
  mentorSince?: string | Date;
  profilePictureUrl?: string;
  role: Role;
  googleCalendarAccessToken?: string;
  googleCalendarRefreshToken?: string;
  outlookCalendarAccessToken?: string;
  outlookCalendarRefreshToken?: string;
}


