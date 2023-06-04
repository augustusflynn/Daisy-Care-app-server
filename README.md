### Migrate cmd

```sh
npx sequelize-cli db:migrate
```

### Sedding cmd

```sh
npx sequelize-cli db:seed:all
```

### Back up DB

```sh
pg_dump -U your_username -Fc daisy-care > /home/user/backups/database_backup.dump
```


### Restore DB

```sh
pg_restore -U your_username -C -h hostname -p port_number -d new_database_name -Fc database_backup.dump.gz
```