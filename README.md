# Task 2: Web Application

Implement a simple backend, testing through CI, and a frontend SPA.  
Isnt this pretty much a full stack? 

## Report

* [Report](Report/report.md)

## Running

1. `git clone https://github.com/keyule/3001-Task2.git`
2. `docker-compose up --build -d`
3. API sits on port 3000 
4. Web server sits on port 8080
5. Tests run on port 3001


## End points

**API: Port 3000**  

| End Point | Type | Description | Parameters | 
| ----------- |-------------| ----------- | --------------|
| /todos | GET | Returns all todos | - |
| /todos | POST | Creates a new todo | {"title": "test"} | 
| /todos/:id | PUT | Marks as completed | {"completed": true} |
| /todos/:id | DELETE | Delets a todo | - |

## Testing

- `docker-compose exec app npm run test`


