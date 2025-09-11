export function createCTrader({ CTrader }) {

    async function createCTraderHandler(req, res) {
        try {
            const { trader_name, amount, rate, profit, image, description } = req.body;

        } catch (err) {
            console.error("createCTraderHandler error:", err && err.stack ? err.stack : err);
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }

    return {
        createCTraderHandler
    };
}
