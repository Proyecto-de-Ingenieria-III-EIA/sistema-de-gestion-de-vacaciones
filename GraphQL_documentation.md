## Principal page:
### Absences in a given time period
Only valid for Admins

This will return the absences that are comprehended between two dates, this is for if the calendar is either weekly, or monthly

`getAbsencesTimePeriod: [Absences]` 
This returns both the confirmed absences and the pending requests. The confirmed absences are the ones that have been approved by the admin. The pending requests are the ones that have been requested by the user but haven't been approved or denied yet. The absences are returned in a list of objects of the type `Absences`.

### Get a specific absence request
