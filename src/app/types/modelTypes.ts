export interface Application {
  id: number;
  position_name: string;
  company: string;
  notes?: string;
  status_id: number;
  status: ApplicationStatus;
};

export interface JobApplication extends Application {
  version: number;
  created_at: string;
  user_id: number;
  user: User;
}

export interface ApplicationStatus {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  created_at: string;
}