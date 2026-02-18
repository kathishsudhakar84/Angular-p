
export interface Project {
  id?: number;
  created_at?: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  tags: string[];
}

export interface Experience {
  id?: number;
  created_at?: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface BlogPost {
  id?: number;
  created_at?: string;
  title: string;
  content: string;
  image_url?: string;
  author: string;
}

export interface ContactMessage {
    id?: number;
    created_at?: string;
    name: string;
    email: string;
    message: string;
}
