const request = require('supertest');
const app = require('./testServer');
const Objekt = require('../models/Building');
const Dvere = require('../models/Door');
const IotNode = require('../models/Device');
require('./setup');

describe('IoT Device Endpoints', () => {
    // Test data
    let objectId, doorId;
    const testDevice = {
        name: 'AA:BB:CC:DD:EE',
        description: 'Test Device'
    };

    let createdDeviceId;

    // Create test object and door before all tests
    beforeEach(async () => {
        const obj = await Objekt.create({
            name: 'Test Object',
            description: 'Test Object Description',
            ownerId: '123'
        });
        objectId = obj.id;

        const door = await Dvere.create({
            objectId,
            name: 'Test Door',
            description: 'Test Door Description',
            locked: true
        });
        doorId = door.id;
        testDevice.doorId = doorId;
    });

    // Test list-device endpoint
    describe('GET /device', () => {
        beforeEach(async () => {
            // Create some test devices
            await IotNode.create([
                {...testDevice, name: 'AA:BB:CC:DD:EE:01'},
                {...testDevice, name: 'AA:BB:CC:DD:EE:02'},
                {...testDevice, name: 'AA:BB:CC:DD:EE:03', doorId: 'different-door-id'}
            ]);
        });

        it('should return a list of all devices', async () => {
            const res = await request(app).get('/device');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(3);
            expect(res.body.pageInfo).toHaveProperty('total', 3);
        });

        it('should filter devices by doorId', async () => {
            const res = await request(app).get(`/device?doorId=${doorId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(2);
            expect(res.body.itemList[0].doorId).toEqual(doorId);
        });

        it('should paginate results', async () => {
            const res = await request(app).get('/device?page=1&pageSize=2');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(2);
            expect(res.body.pageInfo).toHaveProperty('totalPages', 2);
        });
    });

    // Test create-device endpoint
    describe('POST /device/create', () => {
        it('should create a new device with system profile header', async () => {
            const res = await request(app)
                .post('/device/create')
                .send(testDevice);

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Vytvořeno');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.name).toEqual(testDevice.name);

            createdDeviceId = res.body.data.id;
        });

        it('should deny access without system profile header', async () => {
            const res = await request(app)
                .post('/device/create')
                .send(testDevice);

            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toEqual('Access denied. System profile required.');
        });

        it('should return validation error for missing required fields', async () => {
            const res = await request(app)
                .post('/device/create')
                .send({name: 'Incomplete Device'});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('details');
        });
    });

    // Test update-device endpoint
    describe('PUT /device/update', () => {
        beforeEach(async () => {
            // Create a test device to update
            const device = await IotNode.create(testDevice);
            createdDeviceId = device.id;
        });

        it('should update an existing device', async () => {
            const updateData = {
                id: createdDeviceId,
                name: 'FF:EE:DD:CC:BB:AA',
                description: 'Updated Description'
            };

            const res = await request(app)
                .put('/device/update')
                .send(updateData);

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Upraveno');
            expect(res.body.data.name).toEqual('FF:EE:DD:CC:BB:AA');
        });

        it('should return 404 for non-existent device', async () => {
            const res = await request(app)
                .put('/device/update')
                .send({
                    id: 'non-existent-id',
                    name: 'Will Not Update'
                });

            expect(res.statusCode).toEqual(404);
        });
    });

    // Test delete-device endpoint
    describe('DELETE /device/delete', () => {
        beforeEach(async () => {
            // Create a test device to delete
            const device = await IotNode.create(testDevice);
            createdDeviceId = device.id;
        });

        it('should delete an existing device', async () => {
            const res = await request(app)
                .delete('/device/delete')
                .send({id: createdDeviceId});

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Smazáno');

            // Verify device is deleted
            const count = await IotNode.countDocuments({id: createdDeviceId});
            expect(count).toEqual(0);
        });
    });
});
