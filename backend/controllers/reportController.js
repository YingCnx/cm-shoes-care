import Report from "../models/Report.js";

export const getReports = async (req, res) => {
    try {
        const { report_type,start_date, end_date, branch_id } = req.query;
        let reportData;
        switch (report_type) {
            case "income":
                reportData = await Report.getIncomeReport(start_date, end_date, branch_id);
                break;
            case "payout":
                reportData = await Report.getPayoutsReport(start_date, end_date, branch_id);
                break;
            case "profitloss":
                reportData = await Report.getProfitLossReport(start_date, end_date, branch_id);
                break;
            case "topservices":
                reportData = await Report.getTopServicesReport(start_date, end_date, branch_id);
                break;
            case "customer":
                reportData = await Report.getCustomerReport(start_date, end_date, branch_id);
                break;
            default:
                return res.status(400).json({ message: "Invalid report type" });
        }

        res.json(reportData);
    } catch (error) {
        console.error("🔴 Error fetching reports:", error);
        res.status(500).json({ message: "Error fetching reports" });
    }
};
