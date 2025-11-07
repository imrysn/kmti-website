export interface ContactPageProps {}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactInfo {
  id: number;
  type: 'email' | 'phone' | 'address';
  label: string;
  value: string;
  icon: string;
}