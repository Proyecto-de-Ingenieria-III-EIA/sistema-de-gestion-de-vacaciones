<div align="center">
<h1>Vacation and Absence Manager</h1>
</div>

---

## Description
This is a software made for managing vacations and absences of employees. It is a web application that allows employees to request vacations and absences, and managers to approve or reject them. It also allows managers to register when people are abscent without any type of request, for example, someone that just didn't show up to work.

For the absences, you have the option to add justification why you want to have an abscence (for example, a doctor's appointment), and for the people that didn't show up to work, they can add a reason why they didn't show up.
<br><br>
<h3>Characteristics:</h3>

- An employee can request a vacation. 
<br>The vacations are in days, so for example, I want to have vacations from 10 february to 17 of february. The application itself will keep track of the vacations the employee has left (both legally, or in case a comany offers more than the llegally required vacations), has taken, etc.
<br>The employer can approve or reject the vacation request (depending on the legality), and add comments of the why of the decision, or just some extra comments that he sees fit.

- An employee can request absences. 
<br>Absences are measured in periods, that way, you can ask, for example, to have a leave between 2pm and 4pm so you can go to your kid's recital.
<br>For these absence requests, you can add a justification, this can be initially just a text and then add a file (for example, a doctor's note), or directly add the file. 
<br>The employer can approve or reject the absence request, and add comments of the why of the decision, or just some extra comments that he sees fit (for example: "This is the last leave I give you this month because ...." or "I'll give you this one, but from now on please ask with X days of anticipation").

- An employer can add absences for an employee.
<br>If an employee didn't show up to work, or showed up late, or he dissapeared in the middle of work, the employer can add an absence for the period that the employee was absent.
<br>The employer can add some extra comments to that absence, like: "He didn't show up to deployment day" or "He missed the meeting with the client". The objective of these comments is that the employer can keep track of the employee's actions with a context, since is worse to miss a client meeting, than just dissapearing for 2 hours, even if they technically are the same time period. These extra comments can be selected as to only be visible by the employer, or by the employee too.
<br>The employee can later see this absence and add a justification for that absence, this justification accepts files, just text, or both. A real example: "I'm sorry I missed my first day, I got ran over by a bus" and add a photo of the results of being ran over.
<br>Finally, the employer can review the justification and classify that absence as a valid one or not. If the employee does not add a justification, the absence will be classified as invalid by default (If the employee talks to the employer in person, we still expect the employee to add the justification, as to still have the correct context for furuture revies).

- For every employer, he can see a registry of all his petitions (and their current or final status), the absences he have had, and some important metrics that may be important.

- For every employer, he can open the profile of any employee and see the same all the information described above.

- The UI for an employer will be that of a calendar, where he can see metrics for each day of that calendar, for example, for the 19 of february, there's gonna be 16 people absent (either because of vacations or requested absences). It is obvious to note that these exact metrics can only be made to absences that have been approved, but for a future, we could add a predictive system for the unannounced absences.

## Technologies

- 🔥 **Next.js 15.1.6**
- 🔒 **Authentication** via NextAuth.js and Auth0
- 💅 **TailwindCSS**
- 🎨 **Shadcn UI** components based on Radix UI
- 🏗️ **Atomic Design** principles
- 📱 **Responsive** layouts
- 🚀 **Bun** for faster development
- 📜 **ESLint** and **Prettier** for code quality
- 🗄️ **PostgreSQL** database
- 📦 **Prisma** for database access
- 📊 **GraphQL** for data fetching
