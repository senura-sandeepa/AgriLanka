import db from "./database/config.js";

export const addCrop = async (data) => {
    await db.query(`
    INSERT INTO crops (farmer_id, crop_name, quantity, price, unit)
    VALUES (?, ?, ?, ?, ?)
  `, [
        data.farmerId,
        data.cropName,
        data.quantity,
        data.price,
        data.unit
    ]);
};

export const getCropsByFarmer = async (farmerId) => {
    const [rows] = await db.query(
        "SELECT * FROM crops WHERE farmer_id = ?",
        [farmerId]
    );
    return rows;
};

export const deleteCrop = async (cropId) => {
    await db.query("DELETE FROM crops WHERE id = ?", [cropId]);
};
