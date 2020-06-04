db = db.getSiblingDB('backendapp');
db.createUser(
    {
        user: "chan",
        pwd: "chan",
        roles: [
            {
                role: "readWrite",
                db: "backendapp"
            }            
        ]
    }
);

db = db.getSiblingDB('backendapptest');
db.createUser(
    {
        user: "chan",
        pwd: "chan",
        roles: [
            {
                role: "readWrite",
                db: "backendapptest"
            }            
        ]
    }
);