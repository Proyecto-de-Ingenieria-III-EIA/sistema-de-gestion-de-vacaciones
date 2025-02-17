# Notes
This are some notes for the development, since we are currently learning everything, to keep all we learn here.

## Prisma
* For generating the code for easy manage of the entities, we need to run the following command:
```bunx prisma generate```

* For migrating the prisma changes to the database, we need to run the following command:
```bunx prisma migrate dev --name <migration-name>```

* When making table relationships (specifically one to one, or one to many), the table that will have the foreign you put the `@relation(...)` with the name of the relation and everything else, the table that is being referenced, you put the `@relation(<name of the relation defined in the referencing table>)`.

* The syntax of @relation is as follows:

```JavaScript
@relation(name: "<name of the relation>", fields: [<fields that are being referenced>], references: [<fields that are being referenced>], map: <database name of the relation>)
```

>>> The `name` parameter in `@relation` is the Prisma-level identifier used for managing relationships in your application code. It won't appear in the database but is used by Prisma to handle the relationship logic. The `map` parameter defines the actual constraint name that will be created in your database schema - this must be unique across all database constraints.


## Github
* `git fetch` This just download the lastest changes, but does not implement them in your working directory, to implement them you need to run `git checkout origin/master`. Finally to save those changes into your git, just have to run `git merge origin/master`.

* `git stash` This command saves the current changes in a stash, so you can work on other things, and then you can run `git stash pop` to recover the changes.

* `git pull` This command downloads the latest changes and implement them in your git directly.

## Next
