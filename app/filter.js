
class Filter {
    constructor() {
        this.orderKey = null;
        this.asc = true;
        this.offset = 0;
        this.limit = null;
    }

    setOrderKey(orderKey) {
        this.orderKey = orderKey;
        return this;
    } 

    setAsc(asc) {
        this.asc = asc;
        return this;
    }

    setOffset(offset) {
        this.offset = offset;
        return this;
    }

    setLimit(limit) {
        this.limit = limit;
        return this;
    }

    applyFilter(query) {
        if(this.orderKey) {
            query = query.order(this.orderKey, this.asc);
        }
        if(this.limit) {
            query = query.limit(this.limit);
        }
        if(this.offset) {
            query = query.offset(this.offset);
        }

        return query;
    }
}

module.exports = Filter;
