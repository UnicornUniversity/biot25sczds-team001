const request = require('supertest');
const app = require('./testServer');
const Dvere = require('../models/Door');
const Log = require('../models/Log');
require('./setup');

describe('Log Endpoints', () => {
    // Test data
    let doorId;
    const testLog = {
        severity: 'warning',
        message: 'Test log message'
    };

    // Create a test door before all tests
    beforeEach(async () => {
        const door = await Dvere.create({
            objectId: 'test-object-id',
            name: 'Test Door',
            description: 'Test Door Description',
            locked: true
        });
        doorId = door.id;
        testLog.relatedDoor = doorId;
    });

    // Test list-log endpoint
    describe('GET /logs', () => {
        beforeEach(async () => {
            // Create some test logs
            await Log.create([
                {...testLog, message: 'Log 1'},
                {...testLog, message: 'Log 2', severity: 'error'},
                {...testLog, message: 'Log 3', relatedDoor: 'different-door-id'}
            ]);
        });

        it('should return a list of all logs', async () => {
            const res = await request(app).get('/logs');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(3);
            expect(res.body.pageInfo).toHaveProperty('total', 3);
        });

        it('should filter logs by relatedDoor', async () => {
            const res = await request(app).get(`/logs?relatedDoor=${doorId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(2);
            expect(res.body.itemList[0].relatedDoor).toEqual(doorId);
        });

        it('should filter logs by severity', async () => {
            const res = await request(app).get('/logs?severity=error');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(1);
            expect(res.body.itemList[0].severity).toEqual('error');
        });

        it('should paginate results', async () => {
            const res = await request(app).get('/logs?page=1&pageSize=2');

            expect(res.statusCode).toEqual(200);
            expect(res.body.itemList).toHaveLength(2);
            expect(res.body.pageInfo).toHaveProperty('totalPages', 2);
        });
    });

    // Test create-log endpoint
    describe('POST /log/create', () => {
        it('should create a new log with system profile header', async () => {
            const res = await request(app)
                .post('/log/create')
                .send(testLog);

            expect(res.statusCode).toEqual(201);
            expect(res.body.status).toEqual(200);
            expect(res.body.message).toEqual('Vytvořeno');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.message).toEqual(testLog.message);
        });

        it('should return validation error for invalid severity', async () => {
            const res = await request(app)
                .post('/log/create')
                .send({
                    ...testLog,
                    severity: 'invalid-severity'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('details');
        });
    });
});
