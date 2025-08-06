// appwrite/config.ts
import { Client, Account, Storage, ID, Databases, Permission, Role } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://nyc.cloud.appwrite.io/v1') // ⚠️ proxy through Next.js
  .setProject('68887420003cf823d4c4')
;     // ✅ your real project ID

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

export { client, account, storage, databases, ID, Permission, Role };
