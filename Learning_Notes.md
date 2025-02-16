# Notes
This are some notes for the development, since we are currently learning everything, to keep all we learn here.

## Prisma
* For generating the code for easy manage of the entities, we need to run the following command:
```bunx prisma generate```

* For migrating the prisma changes to the database, we need to run the following command:
```bunx prisma migrate dev --name <migration-name>```


## Github
`git fetch` This just download the lastest changes, but does not implement them in your working directory, to implement them you need to run `git checkout origin/master`. Finally to save those changes into your git, just have to run `git merge origin/master`.

`git stash` This command saves the current changes in a stash, so you can work on other things, and then you can run `git stash pop` to recover the changes.

`git pull` This command downloads the latest changes and implement them in your git directly.