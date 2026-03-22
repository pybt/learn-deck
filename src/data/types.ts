export interface CardData {
  id: string;
  title: string;
  summary: string;
  details: { heading: string; body: string }[];
}
