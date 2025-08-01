export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  credentials: string[];
}
