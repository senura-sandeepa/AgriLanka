import db from "./database/config.js";

export const createOrder = async (data) => {
    await db.query(`
    INSERT INTO orders (crop_id, farmer_id, supermarket_id, quantity)
    VALUES (?, ?, ?, ?)
  `, [
        data.cropId,
        data.farmerId,
        data.supermarketId,
        data.quantity
    ]);
};

export const getOrdersByFarmer = async (farmerId) => {
    const [rows] = await db.query(
        "SELECT * FROM orders WHERE farmer_id = ?",
        [farmerId]
    );
    return rows;
};

export const updateOrderStatus = async (orderId, status) => {
    await db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, orderId]
    );
};
