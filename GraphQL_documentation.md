# Important note
The Notification_Absence is created by a trigger in the database

## Existing types (That I remember to add here):
`Note: it is a good idea to check for an automatic documentation tool for graphql`
``` graphql
enum RequestedAbsenceType {
    VACATION
    INFORMAL
}

type RequestedAbsence {
    absence Id: ID
    status: String
    aprover: ID
    decisionDate: DateTime

    createdAt: DateTime
    updatedAt: DateTime

    absence: Absence
    currentStatus: RequestStatus
    aproverUser: User

    vacationAbsence: VacationAbsence
    informalAbsence: InformalAbsence
}

type WholeRequestedAbsence {
    dbId: ID
    colaboratorId: User
    startDate: DateTime
    endDate: DateTime
    decisionDate: DateTime
    type: RequestedAbsenceType

    status: RequestStatus
    aprover: User

    createdAt: DateTime
    updatedAt: DateTime
}
```

## Principal page:
### Absences in a given time period
Only valid for admins.

To get all absences in a given time period, you can use the following query:
``` graphql
getAbsencesTimePeriod(startDate: DateTime!, endDate: DateTime!): [WholeRequestedAbsence]
```


### Get a specific absence request
