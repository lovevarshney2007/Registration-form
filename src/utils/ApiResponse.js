class ApiResponse{
    constructor(
        statusCode,
        data,
        message = "Success",
        requestId = null

    )
    {
         this.success = statusCode < 400;
         this.message = message;
        this.data = data;
        if (requestId) {
      this.requestId = requestId;
    }
    }

}


export {
    ApiResponse
}