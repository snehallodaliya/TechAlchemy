/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

 const dotenv = require('dotenv');
 dotenv.config();
 process.env.NODE_ENV = 'test';
 const db = require('mongoose');
 const request = require('supertest');
 const { MongoClient } = require('mongodb');
 const app = require('../app');
 const uri = 'mongodb://127.0.0.1:27017';
 
 const client = new MongoClient(uri, {
   useUnifiedTopology: true,
   useNewUrlParser: true
 });
 
 /**
  * @description : model dependencies resolver
  */
 
 // test cases
 
 describe('POST /register -> if email and username is given', () => {
   test('should register a user', async () => {
     let registeredUser = await request(app)
       .post('/auth/register')
       .send({
         'username':'Kolby44',
         'password':'2unwUZmmgoKJW60',
         'email':'Vickie30@yahoo.com'
       });
     expect(registeredUser.statusCode).toBe(200);
     expect(registeredUser.body.status).toBe('SUCCESS');
     expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
   });
 });
 
 describe('POST /login -> if username and password is correct', () => {
   test('should return user with authentication token', async () => {
     let user = await request(app)
       .post('/auth/login')
       .send(
         {
           username: 'Kolby44',
           password: '2unwUZmmgoKJW60'
         }
       );
     expect(user.statusCode).toBe(200);
     expect(user.body.status).toBe('SUCCESS');
     expect(user.body.data).toMatchObject({
       id: expect.any(String),
       token: expect.any(String)
     }); 
   });
 });
 
 describe('POST /login -> if username is incorrect', () => {
   test('should return unauthorized status and user not exists', async () => {
     let user = await request(app)
       .post('/auth/login')
       .send(
         {
           username: 'wrong.username',
           password: '2unwUZmmgoKJW60'
         }
       );
 
     expect(user.statusCode).toBe(400);
     expect(user.body.status).toBe('BAD_REQUEST');
   });
 });
 
 describe('POST /login -> if password is incorrect', () => {
   test('should return unauthorized status and incorrect password', async () => {
     let user = await request(app)
       .post('/auth/login')
       .send(
         {
           username: 'Kolby44',
           password: 'wrong@password'
         }
       );
 
     expect(user.statusCode).toBe(400);
     expect(user.body.status).toBe('BAD_REQUEST');
   });
 });
 
 describe('POST /login -> if username or password is empty string or has not passed in body', () => {
   test('should return bad request status and insufficient parameters', async () => {
     let user = await request(app)
       .post('/auth/login')
       .send({});
 
     expect(user.statusCode).toBe(400);
     expect(user.body.status).toBe('BAD_REQUEST');
   });
 });
 
 afterAll(function (done) {
   db.connection.db.dropDatabase(function () {
     db.connection.close(function () {
       done();
     });
   });
 });