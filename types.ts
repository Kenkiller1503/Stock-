export interface Insight {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  url: string;
}

export interface Opportunity {
  id: string;
  title: string;
  quote: string;
  expert: {
    name: string;
    role: string;
    imageUrl: string;
  };
  link: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  url: string;
}