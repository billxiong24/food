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
    
change ```.env``` file to appropriate credentials for postgres database.    
    
    
Set up database and dummy data: ```Run psql -f db/food.sql```      
## Start project      
Run ```npm start```. This will start server on localhost:8000. Use ```nodemon```, so don't have to restart server every time changes are made.        
    
    
## API documentation      
## SKUS      
    
### Search for SKUs based on ingredients and product lines.     
* Allows users to search for SKUs, and filter them based on ingredients and prod lines.    
**URL**: ```GET /sku/search```         
  
**PARAMETERS**:     
        
| Parameter      | Description | Type |    
| ----------- | ----------- |---------    
| name      | **Required**. name of SKU to search for. | String |    
| ingredients | **Optional**. List of ingredients to filter SKU by. SKUs returned will contain at least one ingredient. | List |    
| prodlines | **Optional**. List of product lines to filter SKU by. SKUs returned will contain at least one ingredient. | List |      
    
* **EXAMPLE**:     
  
```GET /sku/search?name=sku&ingredients=ing1&ingredients=ing2&prodlines=p1&prodlines=p2```      
Searches for "sku", which must contain one of "ing1" or "ing2", and must be in productline "p1" or "p2".      
    
### Retrieve ingredients of a SKU    
  
* Given a case_upc of a SKU, fetch ingredients associated with that SKU.    
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
|ingredients | **Optional**. List of ingredients tuples to add to SKU. This parameter should be sent in request body. Takes form of ```[{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}] ``` | String (stringified JSON) |      
    
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
| case_upc | **Required**. case UPC of SKU. URL Parameter. | integer |       
    
* **EXAMPLE**     
```DELETE /sku/643```    
deletes a SKU with case_upc 643.       
    
  
### Delete ingredients from a SKU      
* Deletes a list of ingredients from a SKU. Ingredients must exist in SKU.    
**URL**: ```DELETE /sku/:id/ingredients```      
**PARAMETERS**      
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. id of SKU. URL Parameter. | integer |       
| ingredients| **Required**. List of ingredient numbers to delete. | List |    
  
  
* **EXAMPLE**     
```DELETE /643/ingredients```    
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
| name | **Required**. keyword to search by. | String |       
| ingredients| **Optional**. List of SKUs to filter ingredients by. | List |    
  
  
* **EXAMPLE**     
```GET /ingredients/search?name=ing&skus=s1&skus=s2&skus=s3```     
Searches for ingredients with keyword "ing", who must appear in one of "s1, s2, or s3".   

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

### Get SKU's with an ingredient
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
| name | **Required**. Name of keyword to search| String |                

* **EXAMPLE**     
```GET /productline/search?name=prod```    
Searches product lines with keyword "prod"   


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
* Delete a product line who has a given name   
**URL**: ```DELETE /productline/:id```    
**PARAMETERS**   
  
| Parameter      | Description | Type |    
| ----------- | ----------- |---------|    
| id | **Required**. URL Parameter. ID of product line to delete. | Integer |                

* **EXAMPLE**     
```DELETE /productline/25```     
Deletes a product line whose id is 25. If product line has SKUs, will be unable to delete.  

