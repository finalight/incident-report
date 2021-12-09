# Incident Report

## Setup

Create a file ```.env``` at the root directory with the following values

```
PGHOST=arjuna.db.elephantsql.com
PGUSER=bfedxasu
PGDATABASE=bfedxasu
PGPASSWORD=cGMBx39-Qnlp4tsrxeUmLdNIAboZRhrh
PGPORT=5432
```

Then just run ```docker-compose up``` 

----

## Assumptions
- One incident, one assignee only
- admin can create/assign incidents, but cannot resolve incidents. Incidents have to be resolved by users (assignees)
- Timestamp(for created_at, updated_at) defaults to database server timezone (which should be UTC)
- Postgresql -> use elephantsql (external DB service)
- Admin can delete incidents regardless of status
- Firebase users service, handles the authentication layer as well
- No username column, just email
- No superadmin, admins are superadmin
- details are very simple so it's actually part the presentation layer in the table
- admin can create duplicate incidents (same title/details)
- How the assignee resolve incidents is outside of the context boundary, they can only update the status in uni-direction (Not Started -> In Progress -> Done)

----

## What's missing
- No register on UI feature, has to be done through API
- Didn't use ORM, only use prepared statement (node-postgres)
- No logging mechanism (ELK or something similar)
- No environment variable setup 
- Once an incident investigation is started by an assignee, the admin should not be able to change the assignee. This is not done
- Sanity check; should check whether the incident ID exists or not before committing the delete query. This is not done
- UI/backend Validation check, not done as well
- no filtering/sorting/pagination mechanism
- e2e tests not done (think cypress/testcafe/codecept)
- Login form is not guarded; if the user is already logined, it should be redirected to the dashboard. This is not done
- The codebase does not leverage on localstorage or anything similar, so upon refresh the context (logged-in user data) will be gone

