CREATE TABLE tcInvntUsers(
userid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
useremployeeid VARCHAR(255) NOT NULL UNIQUE,
username VARCHAR(255) NOT NULL,
useremail text NOT NULL UNIQUE,
userrole VARCHAR NOT NULL,
userdepartment VARCHAR(255) NOT NULL,
isactive BOOL NOT NULL DEFAULT TRUE,
createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tcItems(
itemid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
itemname VARCHAR(255) NOT NULL,
cataloguenumber VARCHAR(155) NOT NULL UNIQUE,
description text NOT NULL,
category VARCHAR(155) NOT NULL,
subcategory TEXT[],
unitofmeasure VARCHAR(25) NOT NULL,
minstockquantity NUMERIC(12, 4) NOT NULL,
createdby VARCHAR(155) NOT NULL,
createdbyid VARCHAR(155) NOT NULL REFERENCES tcInvntUsers(useremployeeid),
createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedby VARCHAR(155),
updatedbyid VARCHAR(155) REFERENCES tcInvntUsers(useremployeeid),
updatedat TIMESTAMP 
);


CREATE TABLE tcVendors(
vendorid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
vendorname VARCHAR(255) NOT NULL,
primarycontact VARCHAR(255) NOT NULL,
primarycontactemail VARCHAR(255) NOT NULL,
primarycontactphone VARCHAR(255) NOT NULL,
sourceofsupply VARCHAR(255) NOT NULL,
currency VARCHAR(255) NOT NULL,
vendoraddress text,
createdby VARCHAR(155) NOT NULL,
createdbyid VARCHAR(155) NOT NULL REFERENCES tcInvntUsers(useremployeeid),
createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedby VARCHAR(155),
updatedbyid VARCHAR(155) REFERENCES tcInvntUsers(useremployeeid),
updatedat TIMESTAMP 
);

CREATE TABLE tcInventory(
inventid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
itemid UUID NOT NULL REFERENCES tcItems(itemid),
vendorid UUID NOT NULL REFERENCES tcVendors(vendorid),
stockquantity NUMERIC(12, 4),
lotnumber VARCHAR(255),
expirationdate DATE,
priceperqty NUMERIC(12,2) NOT NULL,
totalprice NUMERIC(12,2) NOT NULL,
createdby VARCHAR(155) NOT NULL,
createdbyid VARCHAR(155) NOT NULL REFERENCES tcInvntUsers(useremployeeid),
createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedby VARCHAR(155),
updatedbyid VARCHAR(155) REFERENCES tcInvntUsers(useremployeeid),
updatedat TIMESTAMP 
);

CREATE TABLE tcBomHeaders(
bomuqid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
bomname VARCHAR(255) NOT NULL,
description TEXT,
createdby VARCHAR(155) NOT NULL,
createdbyid VARCHAR(155) NOT NULL REFERENCES tcInvntUsers(useremployeeid),
createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedby VARCHAR(155),
updatedbyid VARCHAR(155) REFERENCES tcInvntUsers(useremployeeid),
updatedat TIMESTAMP
);

CREATE TABLE tcBomLines(
bomid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
bomuqid UUID NOT NULL REFERENCES tcBomHeaders(bomuqid),
itemid UUID NOT NULL REFERENCES tcItems(itemid),        
consumedqty NUMERIC(12,4) NOT NULL,                      
description TEXT       
);


INSERT INTO tcinvntusers(
useremployeeid,
username,
useremail,
userrole,
userdepartment
) VALUES 
('TIPL_033', 'Akshay', 'akshay.ramesh@theracues.com', 'admin', 'bd'),
('TIPL_031', 'Rahul', 'rahul.r@theracues.com', 'admin', 'Lab')
;


SELECT * FROM tcinvntusers;



