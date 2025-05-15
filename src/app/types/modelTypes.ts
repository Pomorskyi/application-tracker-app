export interface JobApplication {
  id: number;
  version: number;           // defaults to 1 on creation
  position_name: string;
  company: string;
  notes?: string | null;     // optional
  created_at: string;        // ISO date string (DateTime)

  status_id: number;
  status: ApplicationStatus; // relation to application_status

  user_id: number;
  user: User;                // relation to user
}

export interface ApplicationStatus {
  id: number;
  name: string;
  // applications?: JobApplication[]; // optional back relation
}

export interface User {
  id: number;
  email: string;
  password: string;
  created_at: string; // ISO date string
  // applications?: JobApplication[]; // optional back relation
}