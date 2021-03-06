export default {
    // For now, only persistent data about users is who is actually logged in if there is someone logged in
    formulas:{
        sort_by:{
            FORMULA_NUM: "No.",
            COMMENTS: "Comments",
            FORMULA_NAME: "Name"
        },
        sort_by_map:{
            "No.":"num",
            "Comments":"comment",
            "Name":"name"
        },
        reverse_sort_by_map:{
            "pkg_size":"Package Size",
            "num":"Formula Number",
            "comment":"Comments",
            "name": "Name"
        },
        filter_type:{
            INGREDIENTS: "Ingredients",
            FORMULA_NAME: "Formula"
        }
    },
    ingredients:{
        sort_by:{
            PACKAGE_SIZE: "Package Size",
            INGREDIENT_NUM: "No.",
            COMMENTS: "Comments",
            VENDOR_INFO: "Vendor Info",
            INGREDIENT_NAME: "Name",
            PACKAGE_COST: "Package Cost"
        },
        sort_by_map:{
            "Package Size":"pkg_size",
            "No.":"num",
            "Comments":"comments",
            "Vendor Info":"vend_info",
            "Name":"name",
            "Package Cost":"pkg_cost"
        },
        reverse_sort_by_map:{
            "pkg_size":"Package Size",
            "num":"Ingredient Number",
            "comments":"Comments",
            "vend_info":"Vendor Info",
            "name": "Name",
            "pkg_cost":"Package Cost"
        },
        filter_type:{
            INGREDIENTS: "Ingredients",
            SKU_NAME: "SKU"
        }
    },
    skus:{
        sort_by:{
            NAME: "Name",
            SKU_NUM: "SKU No.",
            CASE_UPC: "Case UPC No.",
            UNIT_UPC: "Unit UPC No.",
            UNIT_SIZE: "Unit Size",
            COUNT_PER_CASE: "Count Per Case",
            PRODUCT_LINE: "Product Line",
            COMMENTS:"Comments", 
            FORMULA_SCALE: "Formula scale",
            MANUFACTURING_RATE: "Manufacturing rate"
        },
        sort_by_map:{
            "Name":"name",
            "SKU No.":"num",
            "Case UPC No.":"case_upc",
            "Unit UPC No.":"unit_upc",
            "Unit Size":"unit_size",
            "Count Per Case":"count_per_case",
            "Product Line":"prd_line",
            "Comments":"comments",
            "Formula scale": "formula_scale",
            "Manufacturing rate": "man_rate"

        },
        reverse_sort_by_map:{
            "name":"Name",
            "num":"SKU No.",
            "case_upc":"Case UPC No.",
            "unit_upc":"Unit UPC No.",
            "unit_size":"Unit Size",
            "count_per_case":"Count Per Case",
            "prd_line":"Product Line",
            "comments":"Comments", 
            "formula_scale": "FOrmula scale",
            "man_rate": "Manufacturing rate"
        },
        filter_type:{
            SKU_NAME: "SKU",
            INGREDIENTS: "Ingredients",
            PRODUCT_LINE: "Product Line"
        }
    },
    users:{
      ADMIN:'admin'
    },
    colors:{
        primaryColor:'#6F3AD3',
        warningColor:'#FFFF99',
        infoColor:'#DCDCDC',
        errorColor:'#F08080',
        grayText:'#696969',
        yellow:"#CCCC00"
    },
    common_styles:{
        simple_list_text: {
            fontSize: 14,
            float: 'right',
            fontFamily: 'Open Sans',
            fontWeight: 400,
        },
        divider:{
            backgroundColor:"696969",
            height:"1px",
            width: "100%",
            display: "block"
        },
      info_box:{
        backgroundColor:"#DCDCDC",
        textAlign: "left",
        color:"#696969",
        borderRadius:1,
        padding:5,
        paddingRight: "10px",
        paddingTop:"5px",
        paddingBottom:"5px",
        marginBottom:"2px",
        marginTop:"2px",
        borderColor:"#696969",
        border: "solid black 1px",
        borderSize:1
      },
      warning_box:{
          backgroundColor:"#FFFF99",
          color:"#696969",
          textAlign: "left",
          padding:5,
          borderRadius:1,
          paddingRight: "10px",
          paddingTop:"5px",
          paddingBottom:"5px",
          marginBottom:"2px",
          marginTop:"2px",
          borderColor:"#CCCC00",
          border: "solid black 1px",
          borderSize:1
      },
      error_box:{
          backgroundColor:"#F08080",
          color:"#696969",
          textAlign: "left",
          padding:5,
          borderRadius:1,
          paddingRight: "10px",
          paddingTop:"5px",
          paddingBottom:"5px",
          marginBottom:"2px",
          marginTop:"2px",
          borderColor:"#B22222",
          border: "solid black 1px",
          borderSize:1
      },
      simple_list_title:{
        fontSize: 22,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 700,
        margin:10,
        marginBottom:0
        },
        small_list:{
            marginTop: "6px",
            margin:5
        }
    }
  }

export const editableTextStyles = {
    input: {
        color: 'black',
        borderColor: 'black',
        fontFamily: 'Open Sans',
      },
    active_input:{
        color: 'black',
        fontFamily: 'Open Sans',
    },
    cssLabel: {
        color : 'black',
        fontFamily: 'Open Sans',
      },
    
      cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
          borderColor: 'white',
          fontFamily: 'Open Sans',
        },
        color:'black',
        fontFamily: 'Open Sans',
      },
    
      cssFocused: {
        '&$cssFocused': {
            borderColor: 'white',
            color: 'white',
            fontFamily: 'Open Sans',
        }
      },
    
      notchedOutline: {
        color:'black',
        borderWidth: '1px',
        borderColor: 'black',
        fontFamily: 'Open Sans',
      },
}
