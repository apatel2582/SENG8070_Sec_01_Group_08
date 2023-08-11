export default interface PersistenceService {
  create: (name: string) => void;
  // drop: (name: string) => void;
  insert: <T = unknown>(content: T, location: string) => void;
  // update: <T = unknown>(content: T, location: string) => void;
  // delete: <T = unknown>(content: T, location: string) => void;
}
