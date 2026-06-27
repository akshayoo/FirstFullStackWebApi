CREATE TABLE tcSopReview (
reviewId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
sopId UUID NOT NULL REFERENCES tcSopVersions(sopId),
reviewer VARCHAR(255) NOT NULL,
reviewType VARCHAR(50) NOT NULL DEFAULT 'NOT SCHEDULED', -- NOT SCHEDULED | TRIGGERED 
reviewedBy VARCHAR(255),
reviewedByid VARCHAR(255) REFERENCES tcSopUsers(useremployeeid),
reviewedAt TIMESTAMP,
reviewComments TEXT,
reviewOutcome VARCHAR(50), -- APPROVED | REJECTED | REVISION
approver VARCHAR(255),
approveType VARCHAR(50) NOT NULL DEFAULT 'NOT SCHEDULED', -- NOT SCHEDULED | TRIGGERED 
approvedBy VARCHAR(255),
approvedByid VARCHAR(255) REFERENCES tcSopUsers(useremployeeid),
approvedAt TIMESTAMP,
approveComments TEXT,
approveOutcome VARCHAR(50), -- APPROVED | REJECTED | REVISION
createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP
);


CREATE TABLE tcSopContent (
contentId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
sopId UUID UNIQUE NOT NULL REFERENCES tcSopVersions(sopId),
contentHtml TEXT NOT NULL,
contentVersion INT NOT NULL DEFAULT 1,
createdBy VARCHAR(255) NOT NULL REFERENCES tcSopUsers(useremployeeid),
createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP
);

CREATE TABLE tcSopAcknowledgement (
ackId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
sopId UUID NOT NULL REFERENCES tcSopVersions(sopId),
userId VARCHAR(255) NOT NULL REFERENCES tcSopUsers(useremployeeid),
acknowledgedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ackMethod VARCHAR(50) NOT NULL DEFAULT 'MANUAL', -- MANUAL | SYSTEM
UNIQUE (sopId, userId)
);
