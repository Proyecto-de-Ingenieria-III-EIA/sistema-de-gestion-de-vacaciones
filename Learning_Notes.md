# Notes

This are some notes for the development, since we are currently learning everything, to keep all we learn here.

## Prisma

- For generating the code for easy manage of the entities, we need to run the following command:
  `bunx prisma generate`

- For migrating the prisma changes to the database, we need to run the following command:
  `bunx prisma migrate dev --name <migration-name>`

- When making table relationships (specifically one to one, or one to many), the table that will have the foreign you put the `@relation(...)` with the name of the relation and everything else, the table that is being referenced, you put the `@relation(<name of the relation defined in the referencing table>)`.

- The syntax of @relation is as follows:

```JavaScript
@relation(name: "<name of the relation>", fields: [<fields that are being referenced>], references: [<fields that are being referenced>], map: <database name of the relation>)
```

> > > The `name` parameter in `@relation` is the Prisma-level identifier used for managing relationships in your application code. It won't appear in the database but is used by Prisma to handle the relationship logic. The `map` parameter defines the actual constraint name that will be created in your database schema - this must be unique across all database constraints.

- To use `findUnique` in prisma, the field you are trying to find must be annotated with the `@unique`, or `@id` or be part of a composite constraint (`@@unique`)

- Primary Keys in Prisma:

  - Use `@id` to mark a field as the primary key
  - Only one field can be marked as `@id` per model
  - Common combinations:
    ```prisma
    id String @id @default(cuid())  // auto-generated unique ID
    id Int @id @default(autoincrement())  // auto-incrementing ID
    id String @id  // manually set ID
    ```
  - For composite/combined primary keys, use `@@id()`:
    ```prisma
    model CompositePrimaryKey {
      firstName String
      lastName  String
      age      Int
      @@id([firstName, lastName])  // Makes firstName + lastName the primary key
    }
    ```
  - You can also create unique composite constraints with `@@unique()`:

    ```prisma
    model UniqueComposite {
      year    Int
      month   Int
      day     Int
      @@unique([year, month, day])  // Combination must be unique
    }
    ```

    - To make a raw SQL query in prisma, use `prisma.$queryRaw` This will return a promise with the result of the query, and is sql injection safe. Raw queries always return arrays

## Github

- `git fetch` This just download the lastest changes, but does not implement them in your working directory, to implement them you need to run `git checkout origin/master`. Finally to save those changes into your git, just have to run `git merge origin/master`.

- `git stash` This command saves the current changes in a stash, so you can work on other things, and then you can run `git stash pop` to recover the changes.

- `git pull` This command downloads the latest changes and implement them in your git directly.

## Next

- Framework Full Stack.
- Front> React y Back> Typescript
- Server Side Rendering or Static

`Create next app`

```
 npx create-next-app@latest --ts
```

- ts : typescript
- App Router is the key of Next
- Hot reloading

`Information about directories`

1.  `public`: Images, pdf or any source.
2.  `next.config.js`: Add configurations for Sas compilers, web packs, etc.
3.  `tsconfig.json`: next configurations as the alias, etc.
4.  `.next`: dev or prod. If something fails, delete this directory.
