const request = require('supertest');
const app = require('./testServer');
require('./setup');

describe('API Integration Tests', () => {
    let objectId, doorId, deviceId;

    // Test the complete flow: create object -> create door -> create device -> create log
    it('should perform a complete flow', async () => {
        // 1. Create an object
        const objectRes = await request(app)
            .post('/object/create')
            .send({
                name: 'Integration Test Object',
                description: 'Created during integration test',
                ownerId: 'test-owner'
            });

        expect(objectRes.statusCode).toEqual(201);
        objectId = objectRes.body.data.id;

        // 2. Create a door for the object
        const doorRes = await request(app)
            .post('/door/create')
            .send({
                objectId,
                name: 'Integration Test Door',
                description: 'Main entrance',
                locked: true
            });

        expect(doorRes.statusCode).toEqual(201);
        doorId = doorRes.body.data.id;

        // 3. Create a device for the door
        const deviceRes = await request(app)
            .post('/device/create')
            .send({
                doorId,
                name: 'AA:BB:CC:DD:EE:FF',
                description: 'Integration test device'
            });

        expect(deviceRes.statusCode).toEqual(201);
        deviceId = deviceRes.body.data.id;

        // 4. Create a log related to the door
        const logRes = await request(app)
            .post('/log/create')
            .send({
                severity: 'info',
                message: 'Integration test completed successfully',
                relatedDoor: doorId
            });

        expect(logRes.statusCode).toEqual(201);

        // 5. Verify we can retrieve all created entities
        const objectsRes = await request(app).get('/object');
        expect(objectsRes.body.itemList).toHaveLength(1);

        const doorsRes = await request(app).get(`/object/${objectId}/door`);
        expect(doorsRes.body.itemList).toHaveLength(1);

        const devicesRes = await request(app).get('/device');
        expect(devicesRes.body.itemList).toHaveLength(1);

        const logsRes = await request(app).get('/logs');
        expect(logsRes.body.itemList).toHaveLength(1);
    });
});
