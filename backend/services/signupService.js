
import db from "./database/config.js";
export const createUserWithProfile = async ({
                                                uid,
                                                name,
                                                ownerName,
                                                email,
                                                phone,
                                                location,
                                                addressNo,
                                                userType,
                                            }) => {
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // 1️⃣ Insert into users table
        const [userResult] = await conn.execute(
            `INSERT INTO users (firebase_uid, email, phone_number, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [uid, email, phone]
        );
        const userId = userResult.insertId;

        // 🔒 Validate location ID (required for both types)
        if (!Number.isInteger(location)) {
            throw new Error("Invalid location ID");
        }

        // 2️⃣ Insert profile depending on userType
        if (userType === "farmer") {
            // Farmer: ownerName and addressNo are required
            if (!ownerName || !addressNo) {
                throw new Error("ownerName and addressNo are required for farmers");
            }

            await conn.execute(
                `INSERT INTO farmer_profiles
                 (user_id, farm_name, owner_name, location_id, address_no, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
                [userId, name, ownerName, location, addressNo]
            );

        } else if (userType === "supermarket") {
            await conn.execute(
                `INSERT INTO supermarket_profiles
                 (user_id, supermarket_name, contact_person, location_id, created_at, updated_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`,
                [userId, name, name, location]
            );

        } else {
            throw new Error("Invalid userType");
        }

        await conn.commit();
        return { success: true, userId };

    } catch (err) {
        await conn.rollback();
        console.error("createUserWithProfile error:", err);
        throw err;

    } finally {
        conn.release();
    }
};
