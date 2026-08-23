class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
        this.filterQuery = {};
    }

    filter() {
        const exclusiveFields = [
            "sort",
            "page",
            "limit",
            "search",
            "fields",
        ];

        let queryObj = { ...this.queryStr };
        exclusiveFields.forEach(field => delete queryObj[field]);

      if (queryObj.genre) {
    const genres = queryObj.genre.split(",");
    queryObj.$or = genres.map(genre => ({
        genres: {
            $regex: `^${genre}$`,
            $options: "i"
        }
     }));

    delete queryObj.genre;
}
        let queryString = JSON.stringify(queryObj).replace(
            /\b(gt|gte|lt|lte)\b/g,
            match => `$${match}`
        );

        queryObj = JSON.parse(queryString);

        this.filterQuery = queryObj;

        this.query = this.query.find(queryObj);

        return this;
    }

    search() {
        if (this.queryStr.search) {

            const keyword = this.queryStr.search;

            this.query = this.query.find({
                title: {
                    $regex: keyword,
                    $options: "i"
                }
            });
        }

        return this;
    }


    fields() {

        if (this.queryStr.fields) {

            const fields = this.queryStr.fields
                .replaceAll(",", " ");

            this.query = this.query.select(fields);

        } 
        return this;
    }


    sort() {

        if (this.queryStr.sort) {

            const sortBy = this.queryStr.sort
                .replaceAll(",", " ");

            this.query = this.query.sort(sortBy);

        } else {

            this.query = this.query.sort("-rating");
        }

        return this;
    }

    pagination() {

        const page = Number(this.queryStr.page) || 1;

        const limit = Number(this.queryStr.limit) || 10;

        const skip = (page - 1) * limit;

        this.query = this.query
            .skip(skip)
            .limit(limit);

        return this;
    }
}

module.exports = ApiFeatures; 
