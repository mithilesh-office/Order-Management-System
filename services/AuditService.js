 class AuditService {

    constructor() {
        this.logs = [];
    }

    log(event, orderId) {

        this.logs.push({
            event,
            orderId,
            timestamp: new Date()
        });
    }

    getLogs() {
        return this.logs;
    }
}

export default AuditService;