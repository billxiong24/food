# 458 project     
     
## Platform requirements   
Ubuntu 18.04     
Node.JS v8.10    
PostgreSQL v10.6    

## Deployment Guide
   
```
git clone https://github.com/billxiong24/food.git   
cd food/
```    

### Set up Postgresql    
```   
sudo apt-get install postgresql postgresql-contrib   
sudo update-rc.d postgresql enable  
sudo service postgresql start  
sudo su - postgres  
psql    
\password    
```      
Enter your password. Update credentials in ```.env``` file.    
     
#### Create databases   
As user ```postgres```, Go to the root of the repository.   
```cd db/ && psql -f food.sql && psql -f unique.sql```    


### Set up Node.JS    
From the root of the repository:    
```   
sudo apt-get install -y nodejs   
sudo apt install npm   
npm install    
```   

### Set up CA  
```
sudo apt-get update
sudo apt-get install software-properties-common   
sudo add-apt-repository universe   
sudo add-apt-repository ppa:certbot/certbot   
```   
Press enter to affirm  
```   
sudo apt-get update  
sudo apt-get install certbot  
```   
     
```
sudo node ca/app.js   
sudo certbot certonly --webroot -w ca/ -d <YOUR DOMAIN NAME HERE>   
```   
Follow prompts.    


### Start server
```npm start``` from root of repository will start server on port 8000.    

  
   

    
   
     
## Development Guide  
We use NodeJS and ExpressJS to build our REST API. We use PostgreSQL to store all our data.   
Each entity (SKU, Ingredient, Product line) is its own table. There are tables for relationships,
such as SKU and Ingred, goals and SKUs. The data tables are in ```food.sql```.  
We use ReactJS to build the views and front end.  
Follow the deployment guide above to set up local environment. 
In the ```.env``` file, set ```HTTPS='false'```, to disable HTTPS.   

After that, run ```npm start```. There will be a server on ```localhost:8000```.
To start the React Server, ```cd food-frontend/ && npm start```. A browser tab should appear.   

    
## API documentation      
## SKUS      
    
### Search for SKUs based on ingredients and product lines.     
* Allows users to search for SKUs, and filter them based on ingredients and prod lines.    
**URL**: ```GET /sku/search```         
  
**PARAMETERS**:     
        
| Parameter      | Description | Type |    
| ----------- | ----------- |---------    
| names      | **Required**. names of SKUs to search for. | List |    
| ingredients | **Optional**. List of ingredients to filter SKU by. SKUs returned will contain at least one ingredient. | List |    
| prodlines | **Optional**. List of product lines to filter SKU by. SKUs returned will contain at least one ingredient. | List |      
| orderKey | **Optional**. Column to order results by. | String |      
| asc | **Optional**. Either 1 or 0. 1 for ascending, 0 for descending. Defaults to 1. | List |    
|limit | **Optional**. Number of search results to return. No parameter returns everything. | integer |   
| offset | **Optional**. Index at which to start returning results. No parameter starts at 0. | integer |     

    
* **EXAMPLE**:     
  
```GET /sku/search?names=sku&ingredients=ing1&ingredients=ing2&prodlines=p1&prodlines=p2&orderKey=name```      
Searches for "sku", which must contain one of "ing1" or "ing2", and must be in productline "p1" or "p2". Orders SKUs by name, ascending.         
    
### Retrieve ingredients of a SKU    
  
* Given ID of a SKU, fetch ingredients associated with that SKU.    
**URL:** ```GET /sku/:id/ingredients```      
**PARAMETERS**:     
      
| Parameter      | Description | Type |    
| ----------- | ----------- |---------    
| id | **Required**. The id of a SKU. This is part of the URL | integer |     
  
* **EXAMPLE**:     
```GET /sku/634/ingredients```       
Retrieves ingredients for SKU with id = 634.    
     
     
### Add ingredients to existing SKU    
* Given existing SKU, add a list of ingredient tuples to that SKU. Ingredients must already exist.   
**URL**: ```POST /sku/:id/ingredients```      
**PARAMETERS**:     
      
| Parameter      | Description | Type |    
| ----------- | ----------- |---------    
| id | **Required** The id of a SKU. This is part of the URL. | integer |    
|ingredients | **Optional**. List of ingredients tuples to add to SKU. This parameter should be sent in request body. Takes form of ```[{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}] ``` ingred_num is ingredient number. | String (stringified JSON) |      
    
* **Example**     
```POST /sku/634/ingredients```      
With request body:     
```    
{    
    ingredients: [    
        {    
            ingred_num: 1,     
            quantity: 1     
        },     
        {    
            ingred_num: 2,     
            quantity: 2    
        }    
    ]    
}    
```     
Adds 2 existing ingredients to SKU with id 634. **Note**: the ingredients must already exist.     
    
  
### Add a SKU    
  
* **URL**: ```POST /sku```      
Create a SKU.    
  
**PARAMETERS**:     
  
The following parameters are all in request body.    
    
| Parameter      | Description | Type |    
| ----------- | ----------- |---------    
| Name | **Required**. Name of SKU. | String |     
| case_upc | **Required**. case UPC of SKU. | Integer |     
| unit_upc | **Required**. unit UPC of SKU. | Integer |     
| num | **Optional**. an id number for SKU. Auto-generated if not supplied| Integer |     
| unit_size | **Required** unit size. | String |     
| count_per_case | **Required**. count per case | Integer |     
| prd_line | **Required**. Product line this SKU belongs to. | String |     
| comments | **Optional**. comments | String |     
   
* **EXAMPLE**     
```POST /sku```      
With request body:    
```      
{      
    name: "sku723",     
    case_upc: 123345,     
    unit_upc: 65653,     
    unit_size: "12 lbs",     
    count_per_case: 998,    
    prd_line: "prod4",    
    comments: "commentingg"    
}    
```    
Creates SKU with those parameters.    
   
    
### Update a SKU.    
  
* Update SKU's parameters.    
**URL**: ```PUT /sku/:id```      
**PARAMETERS**: Same as ```POST /sku```, with the addition of ```id``` in URL, which corresponds to id of the specified SKU.    
**Example**: Same as ```POST /sku```, Except use ```PUT /sku/:id```.      
  
      
### Delete a SKU.    
* Deletes a SKU given id of SKU.    
**URL**: ```DELETE /sku/:id/```      
**PARAMETERS**     
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------    
| id | **Required**. ID of SKU. URL Parameter. | integer |       
    
* **EXAMPLE**     
```DELETE /sku/643```    
deletes a SKU with id 643.       
    
  
### Delete ingredients from a SKU      
* Deletes a list of ingredients from a SKU. Ingredients must exist in SKU.    
**URL**: ```DELETE /sku/:id/ingredients```      
**PARAMETERS**      
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. id of SKU. URL Parameter. | integer |       
| ingredients| **Required**. List of ingredient numbers to delete. | List |    
  
  
* **EXAMPLE**     
```DELETE /sku/643/ingredients```    
With request body:    
```    
{    
    ingredients: [1, 2, 3, 4, 5]    
}    
```    
  
Deletes ingredients "1, 2, 3, 4, and 5" from SKU with id 643, provided that the ingredients exist.       
     
## Ingredients  
### Search for Ingredients

* Search for ingredients by keyword (name), and filtering by SKUs. Ingredients must appear in at least one SKU in the filter.    
**URL**: ```GET /ingredients/search ```         
**PARAMETERS**      
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| names | **Required**. keywords to search by. | List |       
| skus | **Optional**. List of IDs of SKUs to filter ingredients by. | List |    
| orderKey | **Optional**. Column to order results by. | String |      
| asc | **Optional**. Either 1 or 0. 1 for ascending, 0 for descending. Defaults to 1. | List |     
|limit | **Optional**. Number of search results to return. No parameter returns everything. | integer |   
| offset | **Optional**. Index at which to start returning results. No parameter starts at 0. | integer |     
  
  
* **EXAMPLE**     
```GET /ingredients/search?names=ing&skus=1&skus=2&skus=3&orderKey=num&asc=0```     
Searches for ingredients with keyword "ing", who must appear in one of SKUs with ID "1, 2, 0r 3", ordered by num, descending.     

### Create new Ingredient   
* Add ingredient with given parameters to database.   
**URL**: ```POST /ingredients```   
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| name | **Required**. keyword to search by. | String |         
| num | **Optional**. Number of ingredient. Auto-generated if not supplied | Integer |         
| vend_info | **Optional**. Vending info | String |         
| pkg_size | **Required**. Package size. | String |         
| pkg_cost | **Required**. Cost of package | Decimal |         
| comments | **Optional**. Comments| String |         


* **EXAMPLE**     
```POST /ingredients```     
With Request body:   
```  
{  
        name: 'name',  
        vend_info: "something",  
        pkg_size: "4 lbs",  
        pkg_cost: 22  
}
```  
Creates an Ingredient with the specified parameters.    

### Get SKU's associated with an ingredient
* Given an ingredient name, get all SKU's that have that ingredient.   
**URL**: ```GET /ingredients/:id/skus```   
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. Name of existing ingredient. URL parameter | Integer |                


* **EXAMPLE**     
```GET /ingredients/peppers/skus```    
Retrieves all SKU's with "peppers" as an ingredient.    
    
### Update an Ingredient.    
* Update Ingredient's parameters.    
**URL**: ```PUT /ingredients/:id```      
**PARAMETERS**: Same as ```POST /ingredients```, with the addition of ```id``` in URL, which corresponds to the id of a specified ingredient.   
* **Example**: Same as ```POST /ingredients```, Except use ```PUT /ingredients/:id```.    
  
### Delete an Ingredient  
* Delete an ingredient given a name.
**URL**: ```DELETE /ingredients/:id```  
**PARAMETERS**:  
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. id of existing ingredient. URL parameter | Integer |                

* **EXAMPLE**     
```DELETE /ingredients/253```    
Deletes ingredient with id 253. This also removes the ingredient from any SKU's that use it.   
    
## Product Lines
   
### Search for product line
* Given a name, search for product lines with a related name.   
**URL**: ```GET /productline/search```      
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| names | **Required**. Keywords to search| List |                
| orderKey | **Optional**. Column to order results by. | String |      
| asc | **Optional**. Either 1 or 0. 1 for ascending, 0 for descending. Defaults to 1. | List |      
|limit | **Optional**. Number of search results to return. No parameter returns everything. | integer |   
| offset | **Optional**. Index at which to start returning results. No parameter starts at 0. | integer |     
   
* **EXAMPLE**     
```GET /productline/search?names=prod&orderKey=name&asc=0```    
Searches product lines with keyword "prod". Ordered by name, descending.   


### Add a product line
* Create a product line with a given name, provided that the name doesn't already exist.    
**URL**: ```POST /productline```    
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| name | **Required**. Name of product line to add. | String |                

* **EXAMPLE**     
```POST /productline```    
With request body
```
{
    name: 'prod'
}
```
Adds a product line with name 'prod' to database, provided that it doesn't already exist.   

### Update a product line  
* Update a product line's parameters (just name for now.).
**URL**: ```PUT /productline/:id```    
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| name | **Required**. Name of product line to update to. Request body parameter. | String |                
| id | **Required**. URL Parameter. ID of current product line. | Integer |                

* **EXAMPLE**     
```PUT /productline/25```     
With request body  
```  
{  
    name: 'prod1'  
}
```   
Updates a product line whose name id is 25, to "prod1".   

### Delete a product line
* Delete a product line who has a given id.   
**URL**: ```DELETE /productline/:id```    
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of product line to delete. | Integer |                

* **EXAMPLE**     
```DELETE /productline/25```     
Deletes a product line whose id is 25. If product line has SKUs, will be unable to delete.  
  
  
## Manufacturing Goals
  
### Get manufacturing goals for a user
* Get all manufacturing goals for a given user id.   
**URL**: ```GET /manufacturing_goals```    
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| user_id | **Required**. ID of user to search for. | Integer |                 

* **EXAMPLE**     
```GET /manufacturing_goals?user_id=52```     
Retrieve all manufacturing goals for user with id 52.  

### Create manufacturing goal for user
* Create a new manufacturing goal for a user with some ID.   
**URL**: ```POST /manufacturing_goals```    
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| user_id | **Required**. ID of user that this goal belongs to. | Integer |       
| name | **Required**. Name of manufacturing goal. | String | 

* **EXAMPLE**     
```POST /manufacturing_goals```     
With request body  
```  
{  
    name: "goal",
    user_id: 2
}  
```   
Creates a manufacturing goal for user "2" with name "goal".   
    
### Update manufacturing goal for user  
* Update parameters of manufacturing goal assigned to some user.   
**URL**: ```PUT /manufacturing_goals/:id```    
**PARAMETERS**  
Same as ```POST /manufacturing_goals```, except for ```id```, which is the id of the manufacturing goal.
* **EXAMPLE**     
```PUT /manufacturing_goals/56```     
With request body  
```  
{  
    name: "newgoal"
}
```   
Updates manufacturing goal "56" to have name "newgoal".   
    
### DELETE manufacturing goal for user
* Delete a manufacturing goal with a given id.   
**URL**: ```DELETE /manufacturing_goals/:id```    
**PARAMETERS**   
   
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of manufacturing goal to delete. | Integer |    
   
  
* **EXAMPLE**     
```DELETE /manufacturing_goals/56```        
  
Deletes manufacturing goal with ID 56.   
   
### GET SKU's of a manufacturing goal   
* Get all SKU's of a manufacturing goal   
**URL**: ```GET /manufacturing_goals/:id/skus```    
**PARAMETERS**   
   
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of manufacturing goal. | Integer |    
    
* **EXAMPLE**     
```GET /manufacturing_goals/56/skus```        
  
Gets SKU's of manufacturing goal with ID 56.   
  
### Add SKU's to a manufacturing goal   
* Add a list of SKU's to an existing manufacturing goal.    
**URL**: ```POST /manufacturing_goals/:id/skus```    
**PARAMETERS**   
   
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of manufacturing goal. | Integer |    
| skus | **Required**. List of SKU's to add. List takes form of ```[{sku_id:1, quantity:1}, {sku_id:2, quantity:2}]```, where ```skud_id``` is ID of SKU, and ```quantity``` is number of SKUs. | List |    

    
* **EXAMPLE**     
```POST /manufacturing_goals/56/skus```           
With request body:   
```  
{
        skus: [
                {
                        sku_id: 1,
                        quantity: 1
                },
                {
                        sku_id: 2,
                        quantity: 2
                }
        ]
}
```
Adds SKUS "1" and "2" with quantities 1 and 2, to manufacturing goal "56".   
  

### Delete SKU's from a manufacturing goal   
* Delete a list of SKU IDs from an existing manufacturing goal.
**URL**: ```DELETE /manufacturing_goals/:id/skus```    
**PARAMETERS**   
   
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of manufacturing goal. | Integer |    
| skus | **Required**. List of SKU's to delete. List takes form of ```[1, 2, 3, 4]```, where each integer is a sku id. | List |    
  
     
* **EXAMPLE**     
```DELETE /manufacturing_goals/56/skus```           
With request body:   
```  
{
        skus: [1, 2, 3, 4]
}
```
Deletes SKUs 1, 2, 3, 4 from manufacturing goal "56". If SKU's do not exist, ignore them.  
  
### GET manufacturing calculations    
* GET manufacturing calculations for a given user id and sku id   
**URL**: ```GET /manufacturing_goals/:id/calculations```    
**PARAMETERS**    
    
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of manufacturing goal. | Integer |       
    
   
* **EXAMPLE**     
```GET /manufacturing_goals/56/calculations```      
Get calculations for manufacturing goal with ID 56. Returns all necessary ingredients with required amounts needed.   


### Export to file format   
* Create a file from JSON data.    
**URL**: ```POST /manufacturing_goals/exported_file```      
**PARAMETERS**    
    
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|      
| format | **Required**. Format of file to create. Currently only accepts "csv". | String |  
| data | **Required**. JSON data to create csv from. Format of data shown below. | List |   
  
* **EXAMPLE**     
```POST /manufacturing_goals/exported_file```     
With request body:    
```
{
        format: "csv",
        data: [
                {
                        name: "a",
                        num: 1
                },
                {
                        name: "b",
                        num: 2 
                },
                {
                        name: "c",
                        num: 3
                }
        ]
}
```   
Creates a csv file, with name and num as columns, and "a, 1", "b, 2", and "c, 3" as rows.   
  
## Bulk Imports
###  Validate bulk import
* Check validity of operations in csv file   
**URL**: ```POST /bulk/bulk_import```    
**PARAMETERS**    
    
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| type | **Required**. Either "sku", "ingredient", or "formula". Specifies which type of file it is. | String |      
| csvfile | **Required**. CSV file itself. | File |       

    
   
* **EXAMPLE**     
```POST /bulk/bulk_import```   
With request body:
```
{  
        type: "sku",
        csvfile: file
}  
```  
with corresponding HTML:  
```  
<form action="/bulk/bulk_import" method="post" enctype="multipart/form-data">
  <input type="file" name="csvfile" />
</form>
```  
Validates the file and returns errors, if any, and whether or not to abort the operations. Sample response:    
```
{
    "abort": true,
    "errors": [
        {
            "code": "23503",
            "detail": "Key (prd_line)=(prod444) is not present in table \"productline\"."   
        },
        {
            "code": "23505",
            "detail": "Ambiguous record in row 3"   
        }
    ],
    "rows": [
        {
            "num": "5",
            "case_upc": "222222",
            "unit_upc": "23511",
            "unit_size": "55lbs",
            "count_per_case": "22",
            "prd_line": "prod69",
            "update": true
        },
        {
            "name": "skutran",
            "num": "53444",
            "case_upc": "25333",
            "unit_upc": "65653",
            "unit_size": "12 lbs",
            "count_per_case": "998",
            "prd_line": "prod4"
        }
    ]
}
```   
If ```abort``` is false, use the ```errors``` field to display error messages to user. You can then feed the ```rows``` field into ```POST /bulk/accept_bulk_import``` to actually commit transaction.   
  
    
###  Commit bulk import
* Commit contents of csv file to database.     
**URL**: ```POST /bulk/accept_bulk_import```      
**PARAMETERS**    
      
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| type | **Required**. Either "sku", "ingredient", or "formula". Specifies which type of file it is. | String |      
| rows | **Required**. List of JSON rows to commit. Use the response from ```/POST/bulk/bulk_import```. | List |       

    
   
* **EXAMPLE**     
```POST /bulk/accept_bulk_import```   
With request body:  
```
{
        type: "sku",
        rows: [
        {
            "num": "5",
            "case_upc": "222222",
            "unit_upc": "23511",
            "unit_size": "55lbs",
            "count_per_case": "22",
            "prd_line": "prod69",
            "update": true
        },
        {
            "name": "skutran",
            "num": "53444",
            "case_upc": "25333",
            "unit_upc": "65653",
            "unit_size": "12 lbs",
            "count_per_case": "998",
            "prd_line": "prod4"
        }
    ]
}
```   
As you can see, the ```rows``` field is taken from the response of the previous route. This can be done if ```abort``` is false.   
   
   
  
    



