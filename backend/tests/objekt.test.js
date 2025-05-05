const request = require('supertest');
const app = require('./testServer');
const Objekt = require('../models/Building');
require('./setup');

describe('Objekt Endpoints', () => {
    // Test data
    const testObject = {
        name: 'Test Chata',
        description: 'Test Description',
        ownerId: '123'
    };

    let createdObjectId;

    // Test list-object endpoint
    describe('GET /object', () => {
        beforeEach(async () => {
            // Create some test objects
            await Objekt.create([
                {...testObject, name: 'Object 1'},
                {...testObject, name: 'Object 2'},
                {...testObject, name: 'Object 3', ownerId: '456'}
            ]);
        });

        it('should return a list of objects', async () => {
            const res = await request(app).get('/object');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(3);
            expect(res.body.pageInfo).toHaveProperty('total', 3);
        });

        it('should filter objects by ownerId', async () => {
            const res = await request(app).get('/object?ownerId=456');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(1);
            expect(res.body.itemList[0].name).toEqual('Object 3');
        });

        it('should paginate results', async () => {
            const res = await request(app).get('/object?page=1&pageSize=2');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(2);
            expect(res.body.pageInfo).toHaveProperty('totalPages', 2);
        });
    });

    // Test create-object endpoint
    describe('POST /object/create', () => {
        it('should create a new object', async () => {
            const res = await request(app)
                .post('/object/create')
                .send(testObject);

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Založeno');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.name).toEqual(testObject.name);

            createdObjectId = res.body.data.id;
        });

        it('should return validation error for missing required fields', async () => {
            const res = await request(app)
                .post('/object/create')
                .send({name: 'Incomplete Object'});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('details');
        });
    });

    // Test update-object endpoint
    describe('PUT /object/update', () => {
        beforeEach(async () => {
            // Create a test object to update
            const obj = await Objekt.create(testObject);
            createdObjectId = obj.id;
        });

        it('should update an existing object', async () => {
            const updateData = {
                id: createdObjectId,
                name: 'Updated Name',
                description: 'Updated Description'
            };

            const res = await request(app)
                .put('/object/update')
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Upraveno');
            expect(res.body.data.name).toEqual('Updated Name');
        });

        it('should return 404 for non-existent object', async () => {
            const res = await request(app)
                .put('/object/update')
                .send({
                    id: 'non-existent-id',
                    name: 'Will Not Update'
                });

            expect(res.statusCode).toEqual(404);
        });
    });

    // Test delete-object endpoint
    describe('DELETE /object/delete', () => {
        beforeEach(async () => {
            // Create a test object to delete
            const obj = await Objekt.create(testObject);
            createdObjectId = obj.id;
        });

        it('should delete an existing object', async () => {
            const res = await request(app)
                .delete('/object/delete')
                .send({id: createdObjectId});

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Smazáno');

            // Verify object is deleted
            const count = await Objekt.countDocuments({id: createdObjectId});
            expect(count).toEqual(0);
        });
    });
});
