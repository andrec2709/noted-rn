export interface IDbStarter {
  /**
   * The database object
   */
  db: any;

  /**
   * Function that initializes the database
   */
  initDb(): Promise<void>; 
}