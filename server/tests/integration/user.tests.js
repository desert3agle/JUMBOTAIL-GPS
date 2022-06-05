const mongoose = require('mongoose');
const app = require('../../src/index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);



describe("-- INTEGRATION TESTS -- (User routes) \n", () => {


    describe("\n POST api/v1/user/signup \n", () => {

        it("should not register the user when input fields are missing ", async () => {
            const user = await chai
                .request(app)
                .post("/api/v1/user/signup")
                .send({
                    first_name: "Harsh",
                    last_name: "Vardhan"
                });
            expect(user.status).to.be.equal(400);
        });

        it("should not register the user with password smaller than 6 character", async () => {
            const response = await chai
                .request(app)
                .post("/api/v1/user/signup")
                .send({
                    first_name: "Harsh",
                    last_name: "Vardhan",
                    email: "test2@gmail.com",
                    password: "1234"
                });
            expect(response.status).to.be.equal(400);
        });

        it("should successfully register a user", async () => {
            const response = await chai
                .request(app)
                .post("/api/v1/user/signup")
                .send({
                    first_name: "Harsh",
                    last_name: "Vardhan",
                    email: "test@gmail.com",
                    password: "1234567"
                });
            expect(response.status).to.be.equal(201);
            expect(response.body).to.be.have.property("user");
            expect(response.body).to.be.have.property("token");
        });

        it("should not register an existing user ", async () => {
            const response = await chai
                .request(app)
                .post("/api/v1/user/signup")
                .send({
                    first_name: "Harsh",
                    last_name: "Vardhan",
                    email: "test@gmail.com",
                    password: "1234567"
                });
            expect(response.status).to.be.equal(409);
        });

    });


    describe("\n POST /api/v1/user/login \n", () => {
        before("Save a user for login tests", async () => {
            await chai
                .request(app)
                .post("/api/v1/user/signup")
                .send({
                    first_name: "Harsh",
                    last_name: "Vardhan",
                    email: "test3@gmail.com",
                    password: "1234567"
                });
        });

        it("should not login with missing fields", async () => {
            const user = await chai
                .request(app)
                .post("/api/v1/user/login")
                .send({
                    email: "test4@gmail.com"
                });
            expect(user.status).to.be.equal(400);
        });

        it("should not login the unregistered user", async () => {
            const user = await chai
                .request(app)
                .post("/api/v1/user/login")
                .send({
                    email: "test4@gmail.com",
                    password: "abcdefg"
                });
            expect(user.status).to.be.equal(400);
        });
        
        it("It should not login the user with invalid password", async () => {
            const user = await chai
                .request(app)
                .post("/api/v1/user/login")
                .send({
                    email: "test3@gmail.com",
                    password: "abcdef"
                });
            expect(user.status).to.be.equal(400);
        });

        it("should successfully login the user", async () => {
            const response = await chai
                .request(app)
                .post("/api/v1/user/login")
                .send({
                    email: "test3@gmail.com",
                    password: "1234567"
                });
            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.have.property("user");
            expect(response.body).to.be.have.property("token");
        });

    });


    describe("\n GET /api/v1/user \n", () => {
        it("should get the logged in user", async () => {
            const response = await chai
                .request(app)
                .get("/api/v1/user");
        
            expect(response.status).to.be.equal(200);
        });

    });


    describe("\n GET /api/v1/user/logout \n", () => {
        it("should log user out", async () => {
            const response = await chai
                .request(app)
                .get("/api/v1/user/logout");
        
            expect(response.status).to.be.equal(200);
        });
    });

    after("dropping test db", async () => {
        await mongoose.connection.dropDatabase(() => {
            console.log("\n Test database dropped");
        });
    });
});