export class SuccessResponse
{
    status:number;
    message:unknown;
    data:unknown;
    constructor(status=200,message=`Success ${process.pid}`,data={})
    {
        this.status=status;
        this.message=message;
        this.data=data;
    }
}

export class ErrorResponse
{
    status:number;
    message:unknown;
    constructor(status=404,message=`failure ${process.pid}`)
    {
        this.status=status;
        this.message=message;
    }

}