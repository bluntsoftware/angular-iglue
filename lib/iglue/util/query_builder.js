
/*
    QueryBuilder
 */
(function () {
    function QueryBuilder() {
        this.page = 1;
        this.rows = 20;
        this.sord = 'ASC';
        this.sidx = '_id';
        this.criteria = {};
        this.projection = {};
        this.totalpages = 0;
        this.totalrecords = 0;
        this.orMode = false;
        this.orCriteria = {};
    }
    QueryBuilder.prototype.setRows = function(rows){
        this.rows = rows;
        return this;
    };
    QueryBuilder.prototype.or = function(){
        this.orMode = true;
        return this;
    };
    QueryBuilder.prototype.and = function(){
        this.orMode = false;
        return this;
    };
    QueryBuilder.prototype.setPage = function(page){
        var totalPages = Number(this.totalpages);
        var pageNumber = Number(page);
        if(pageNumber > totalPages){ pageNumber = totalPages;}
        if(pageNumber < 1){ pageNumber =1;}
        this.page = Number(pageNumber);
        return this;
    };
    QueryBuilder.prototype.nextPage = function(){
        return this.setPage(Number(this.page)+1);
    };
    QueryBuilder.prototype.previousPage = function(){
        return this.setPage(Number(this.page)-1);
    };
    QueryBuilder.prototype.addColumn = function(field){
        this.projection[field] = 1;
        return this;
    };
    QueryBuilder.prototype.build = function(){
        if( this.orCriteria['$or']){
            this.criteria['$and'].push(this.orCriteria);
        }
        return {
            page : this.page,
            rows : this.rows,
            sord:this.sord,
            sidx :this.sidx,
            orMode : this.orMode,
            filterByFields : JSON.stringify(this.criteria),
            projection :JSON.stringify(this.projection)
        };
    };

    QueryBuilder.prototype.toggleSort = function(){
        if(this.sord === 'ASC'){
            this.sord =  'DESC';
        } else{
            this.sord =  'ASC';
        }
        return this;
    };
    QueryBuilder.prototype.ascending = function(){
        this.sord = 'ASC';
        return this;
    };
    QueryBuilder.prototype.descending = function(){
        this.sord = 'DESC';
        return this;
    };

    QueryBuilder.prototype.qry = function(){
        this.criteria = {};
        this.orCriteria = {};
        this.projection = {};
        this.orMode = false;
        return this;
    };
    QueryBuilder.prototype.rowS = function(rows){
        this.rows = rows;
        return this;
    };
    QueryBuilder.prototype.sidX = function(id){
        this.sidx = id;
        return this;
    };
    //{'name' = {'$regex'  =   val, '$options'  =  'i'}}
    QueryBuilder.prototype.add = function(searchField,searchOper,searchString){

        if(!searchString || searchString === ''){
            return this;
        }

        var condition = {}, criteria = {};
        if(searchOper === 'icn'){
            condition = {'$regex':searchString,'$options':'i'};
        }else{
            condition['$' + searchOper] = searchString;
        }
        criteria[searchField] = condition;

        var and = this.criteria['$and'];
        if(!and){
            and = [];
        }

        if(this.orMode){
            var or = this.orCriteria['$or'];
            if(!or){
                or = [];
            }
            or.push(criteria);
            this.orCriteria['$or'] = or;
        }else{
            and.push(criteria);
        }
        this.criteria['$and'] = and;
        return this;
    };

    QueryBuilder.prototype.cn = function(field,value){
        return this.add(field,'cn',value);
    };
    QueryBuilder.prototype.icn = function(field,value){
        return this.add(field,'icn',value);
    };
    QueryBuilder.prototype.bw = function(field,value){
        return this.add(field,'bw',value);
    };
    QueryBuilder.prototype.ew = function(field,value){
        return this.add(field,'ew',value);
    };
    QueryBuilder.prototype.eq = function(field,value){
        return this.add(field,'eq',value);
    };
    QueryBuilder.prototype.ne = function(field,value){
        return this.add(field,'ne',value);
    };
    QueryBuilder.prototype.nc = function(field,value){
        return this.add(field,'nc',value);
    };
    QueryBuilder.prototype.en = function(field,value){
        return this.add(field,'en',value);
    };
    QueryBuilder.prototype.bn = function(field,value){
        return this.add(field,'bn',value);
    };
    QueryBuilder.prototype.gt = function(field,value){
        return this.add(field,'gt',value);
    };
    QueryBuilder.prototype.ge = function(field,value){
        return this.add(field,'ge',value);
    };
    QueryBuilder.prototype.lt = function(field,value){
        return this.add(field,'lt',value);
    };
    QueryBuilder.prototype.le = function(field,value){
        return this.add(field,'le',value);
    };
    QueryBuilder.prototype.in = function(field,value){
        return this.add(field,'in',value);
    };
    QueryBuilder.prototype.nn = function(field,value){
        return this.add(field,'nn',value);
    };
    QueryBuilder.prototype.new = function(){
        return new QueryBuilder();
    };
    window.queryBuilder = new QueryBuilder();

    return( window.queryBuilder );
})();
