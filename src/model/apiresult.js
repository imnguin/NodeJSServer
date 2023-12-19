class apiresult {
    constructor(iserror = false, message = "", messagedetail = "", resultObject = null){
        this.iserror = iserror,
        this.message = message,
        this.messagedetail = messagedetail,
        this.resultObject = resultObject
    }
}
export default apiresult;