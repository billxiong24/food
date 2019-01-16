# 458 project

## Dependencies
```npm install``` to install dependencies.  

### PostgreSQL

CentOS: ```sudo dnf install postgresql-server postgresql-contrib```  
Ubuntu: ```sudo apt-get install postgresql postgresql-contrib```  

Enable postgresql server: ```sudo systemctl enable postgresql```  
Start postgresql server: ```sudo systemctl start postgresql```  
For Fedora, need to initialize db: ```sudo postgresql-setup --initdb --unit postgresql```  

## Start project  
Run ```node app```. This will start server on localhost:8000.  

