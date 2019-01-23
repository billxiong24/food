# 458 project

## Dependencies
```npm install``` to install dependencies.  

### PostgreSQL

CentOS: ```sudo dnf install postgresql-server postgresql-contrib```  
Ubuntu: ```sudo apt-get install postgresql postgresql-contrib```  

For ubuntu:
Start postgresql server: ```sudo service postgresql start```

Fedora:
Enable postgresql server: ```sudo systemctl enable postgresql```  
Start postgresql server: ```sudo systemctl start postgresql```  
For Fedora, need to initialize db: ```sudo postgresql-setup --itdb --unit postgresql```  

Set up database and dummy data: ```Run psql -f db/food.sql```  

## Start project  
Run ```node app```. This will start server on localhost:8000.  

