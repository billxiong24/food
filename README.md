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
### SKUS  

#### Search for SKUs based on ingredients and product lines. 
Allows users to search for SKUs, and filter them based on ingredients and prod lines.
**URL**: ```GET /sku/search```     
**PARAMETERS**: 
| Parameter      | Description | Type |
| ----------- | ----------- |---------
| name      | **Required**. name of SKU to search for. | String |
| ingredients | **Optional**. List of ingredients to filter SKU by. SKUs returned will contain at least one ingredient. | List |
| prodlines | **Optional**. List of product lines to filter SKU by. SKUs returned will contain at least one ingredient. | List |  

**EXAMPLE**: 
```GET /sku/search?name=sku&ingredients=ing1&ingredients=ing2&prodlines=p1&prodlines=p2```  
Searches for "sku", which must contain one of "ing1" or "ing2", and must be in productline "p1" or "p2".  

#### Retrieve ingredients of a SKU
Given a case_upc of a SKU, fetch ingredients associated with that SKU.
**URL:** ```GET /:case_upc/ingredients```  
**PARAMETERS**: 
| Parameter      | Description | Type |
| ----------- | ----------- |---------
| case_upc | **Required**. The case_upc of a SKU. This is part of the URL | integer | 
**EXAMPLE**: 
```GET /sku/634/ingredients```   
Retrieves ingredients for SKU with case_upc = 634.


#### Add ingredients to existing SKU
Given existing SKU, add a list of ingredient tuples to that SKU.
**URL**: ```POST /sku/:case_upc/ingredients```  
**PARAMETERS**: 
| Parameter      | Description | Type |
| ----------- | ----------- |---------
| case_upc | **Required** The case_upc of a SKU. This is part of the URL. | integer |
|ingredients | **Optional**. List of ingredients tuples to add to SKU. This parameter should be sent in request body. Takes form of ```[{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}] ``` | String (stringified JSON) |  

**Example** 
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
Adds 2 ingredients to SKU with case_upc 634.  

#### Add a SKU
**URL**: ```POST /sku```  
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
**Example** 
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

#### Update a SKU.
Update SKU's parameters.
**URL**: ```PUT /sku/:case_upc```  
**PARAMETERS**: Same as ```POST /sku```, with the addition of ```case_upc``` in URL, which corresponds to case UPC of the specified SKU.
**Example**: Same as ```POST /sku```, Except use ```PUT /sku```.  

#### Delete a SKU.
**URL**: ```DELETE /:case_upc/ingredients```  
**PARAMETERS** 
| Parameter      | Description | Type |
| ----------- | ----------- |---------
| case_upc | **Required**. case UPC of SKU. URL Parameter. | integer |   
**Example** 
```DELETE /sku```
With request body:
```
{
    case_upc: 643
}
```  
deletes a SKU with case_upc 643.   

#### Delete ingredients from a SKU  
Deletes a list of ingredients from a SKU. Ingredients must exist in SKU.
**URL**: ```DELETE /:case_upc/ingredients```  
**PARAMETERS**  
| Parameter      | Description | Type |
| ----------- | ----------- |---------|
| case_upc | **Required**. case UPC of SKU. URL Parameter. | integer |   
| ingredients| **Required**. List of ingredient numbers to delete. | List |
**Example** 
```DELETE /643/ingredients```
With request body:
```
{
    ingredients: [1, 2, 3, 4, 5]
}
```
Deletes ingredients "1, 2, 3, 4, and 5" from SKU with case UPC 643, provided that the ingredients exist.   

## Ingredients












