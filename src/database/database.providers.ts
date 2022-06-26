import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'db-aqfea-kr.vpc-pub-cdb.ntruss.com',
        port: 3306,
        username: 'hmm-team',
        password: 'hmmteam123!',
        database: 'best-friend',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
