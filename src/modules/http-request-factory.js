export class HttpRequestFactory{
    constructor(apiUrl, apiKey){
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    async get(path, queryString){
        const response = await fetch(this.getRequestUrl(path, queryString), 
        {
            method: "GET"
        });
        return await response.json();
    }

    async post(path, queryString, data){
        const response = await fetch(this.getRequestUrl(path, queryString), 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }

    async put(path, queryString, data){
        const response = await fetch(this.getRequestUrl(path, queryString), 
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }

    async delete(path, queryString){
        const response = await fetch(this.getRequestUrl(path, queryString), 
        {
            method: "DELETE"
        });
        return await response.json();
    }

    getRequestUrl(path, queryString){
        const qs = queryString ? `${ "&" + queryString}` : "";
        return `${this.apiUrl}/${path}?apiKey=${this.apiKey}${qs}`;
    }
}