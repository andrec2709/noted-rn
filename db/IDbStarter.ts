export interface IDbStarter {
  db: any;
  initDb(): Promise<void>; 
}