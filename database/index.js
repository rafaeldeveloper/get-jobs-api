const { Client } = require('pg')

export const client = new Client({
  connectionString: "postgres://ppewmoakgfiumc:0cd47a74912697b79fece86171be6e45c8050a4d2a4f10f09d674896bc6ee4ab@ec2-18-211-48-247.compute-1.amazonaws.com:5432/dao9or2k8hacds",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

