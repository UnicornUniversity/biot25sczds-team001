const request = require('supertest');
const app = require('./testServer');
const Objekt = require('../models/Building');
const Dvere = require('../models/Door');
require('./setup');

describe('Door Endpoints', () => {
    let objectId;
    const testDoor = {
        name: 'Test Door',
        description: 'Test Door Description',
        locked: true
    };

    let createdDoorId;

    // Create a test object before all tests
    beforeEach(async () => {
        const obj = await Objekt.create({
            name: 'Test Object',
            description: 'Test Object Description',
            ownerId: '123'
        });
        objectId = obj.id;
        testDoor.objectId = objectId;
    });

    // Test list-door endpoint
    describe('GET /object/:objectId/door', () => {
        beforeEach(async () => {
            // Create some test doors
            await Dvere.create([
                {...testDoor, name: 'Door 1'},
                {...testDoor, name: 'Door 2'},
                {...testDoor, name: 'Door 3'}
            ]);
        });

        it('should return a list of doors for an object', async () => {
            const res = await request(app).get(`/object/${objectId}/door`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(3);
            expect(res.body.pageInfo).toHaveProperty('total', 3);
        });

        it('should paginate results', async () => {
            const res = await request(app).get(`/object/${objectId}/door?page=1&pageSize=2`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(2);
            expect(res.body.pageInfo).toHaveProperty('totalPages', 2);
        });
    });

    // Test create-door endpoint
    describe('POST /door/create', () => {
        it('should create a new door', async () => {
            const res = await request(app)
                .post('/door/create')
                .send(testDoor);

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Vytvořeno');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.name).toEqual(testDoor.name);

            createdDoorId = res.body.data.id;
        });

        it('should return validation error for missing required fields', async () => {
            const res = await request(app)
                .post('/door/create')
                .send({name: 'Incomplete Door'});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('details');
        });
    });

    // Test update-door endpoint
    describe('PUT /door/update', () => {
        beforeEach(async () => {
            // Create a test door to update
            const door = await Dvere.create(testDoor);
            createdDoorId = door.id;
        });

        it('should update an existing door', async () => {
            const updateData = {
                id: createdDoorId,
                name: 'Updated Door Name',
                locked: false
            };

            const res = await request(app)
                .put('/door/update')
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Upraveno');
            expect(res.body.data.name).toEqual('Updated Door Name');
            expect(res.body.data.locked).toEqual(false);
        });

        it('should return 404 for non-existent door', async () => {
            const res = await request(app)
                .put('/door/update')
                .send({
                    id: 'non-existent-id',
                    name: 'Will Not Update'
                });

            expect(res.statusCode).toEqual(404);
        });
    });

    // Test delete-door endpoint
    describe('DELETE /door/delete', () => {
        beforeEach(async () => {
            // Create a test door to delete
            const door = await Dvere.create(testDoor);
            createdDoorId = door.id;
        });

        it('should delete an existing door', async () => {
            const res = await request(app)
                .delete('/door/delete')
                .send({id: createdDoorId});

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Smazáno');

            // Verify door is deleted
            const count = await Dvere.countDocuments({id: createdDoorId});
            expect(count).toEqual(0);
        });
    });
});
