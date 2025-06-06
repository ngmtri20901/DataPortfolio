export interface NotionPortfolioItem {
  id: string;
  title: string;
  content: string;
  link?: string;
  section: 'Skills' | 'Certificates' | 'Projects' | 'About' | 'Contact';
  order: number;
  icon?: string;
}

export interface NotionDatabaseResult {
  object: string;
  id: string;
  properties: Record<string, unknown>;
  created_time: string;
  last_edited_time: string;
}

export interface NotionResponse {
  results: NotionDatabaseResult[];
  next_cursor?: string;
  has_more: boolean;
}

export interface PortfolioSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content?: Array<{ title: string; desc: string; link?: string }>;
  backgroundImage: string;
} 