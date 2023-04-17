let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('TODO API', () => {

    /**
     * Test the GET route
     */
    describe("GET /todos", () => {
        it("It should GET all the todos", (done) => {
            chai.request(server)
                .get("/todos")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                done();
                });
        });

        it("It should NOT GET all the todos", (done) => {
            chai.request(server)
                .get("/todo")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });

    });    

    /**
     * Test the POST route
     */
    describe("POST /todos", () => {
        it("It should POST a new todo", (done) => {
            const todo = {
                title: "TESTING WITH CHAI"
            };
            chai.request(server)                
                .post("/todos")
                .send(todo)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('title').eq("TESTING WITH CHAI");
                    response.body.should.have.property('completed').eq(false);
                done();
                });
        });

        it("It should NOT POST a new todo without the title property", (done) => {
            const todo = {
            };
            chai.request(server)                
                .post("/todos")
                .send(todo)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.have.property('error').eq("Title is required");
                done();
                });
        });

    });


    /**
     * Test the PUT route
     */
    describe("PUT /todos/:id", () => {
        it("It should PUT an existing todo", (done) => {
            const todoId = 1;
            const todo = {
                completed: true
            };
            chai.request(server)                
                .put("/todos/" + todoId)
                .send(todo)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('completed').eq(true);
                done();
                });
        });

        it("It should NOT PUT a todo without the completed property", (done) => {
            const todoId = 1;
            const todo = {
            };
            chai.request(server)                
                .put("/todos/" + todoId)
                .send(todo)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.have.property('error').eq("Completed field is required");
                done();
                });
        });        
    });
    
    /**
     * Test the DELETE route
     */
    describe("DELETE /todos/:id", () => {
        it("It should DELETE an existing todo", (done) => {
            const taskId = 1;
            chai.request(server)                
                .delete("/todos/" + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('id').eq(1);
                done();
                });
        });

        it("It should NOT DELETE a todo that is not in the database", (done) => {
            const taskId = 9999;
            chai.request(server)                
                .delete("/todos/" + taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.have.property('error').eq("Todo item with ID 9999 not found");
                done();
                });
        });

    });




});

