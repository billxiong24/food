export default {
    // For now, only persistent data about users is who is actually logged in if there is someone logged in
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
            COMMENTS:"Comments"
        },
        sort_by_map:{
            "Name":"name",
            "SKU No.":"num",
            "Case UPC No.":"case_upc",
            "Unit UPC No.":"unit_upc",
            "Unit Size":"unit_size",
            "Count Per Case":"count_per_case",
            "Product Line":"prd_line",
            "Comments":"comments"
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
        primaryColor:'#6F3AD3'
    }
  }