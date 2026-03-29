import db from "./database/config.js";

export const getFarmerProfile = async (userId) => {
    try {
        console.log('🔹 Fetching farmer profile for userId:', userId);

        // userId here must be users.id (bigint)
        const [rows] = await db.query(`
            SELECT
                fp.id AS farmer_id,
                fp.farm_name,
                fp.owner_name,
                fp.description,
                fp.address_no,
                l.province,
                l.district,
                l.city,
                l.area,
                u.email,
                u.phone_number,
                fp.bank_name,
                fp.bank_branch,
                fp.account_name,
                fp.account_number
            FROM farmer_profiles fp
                     JOIN locations l ON fp.location_id = l.id
                     JOIN users u ON fp.user_id = u.id
            WHERE fp.user_id = ?
        `, [userId]);

        console.log('✅ Profile fetched:', rows[0] ? 'Found' : 'Not found');

        return rows[0]; // returns undefined if no match
    } catch (error) {
        console.error('❌ Error fetching farmer profile:', error);
        throw error;
    }
};

export const updateFarmerProfile = async (userId, data) => {
    const conn = await db.getConnection();

    try {
        console.log('🔹 Updating farmer profile for userId:', userId);
        console.log('📝 Update data:', data);

        await conn.beginTransaction();

        // Update farmer profile
        const [result] = await conn.query(`
            UPDATE farmer_profiles
            SET
                farm_name = ?,
                owner_name = ?,
                description = ?,
                address_no = ?,
                bank_name = ?,
                bank_branch = ?,
                account_name = ?,
                account_number = ?
            WHERE user_id = ?
        `, [
            data.farmName,
            data.ownerName,
            data.description,
            data.addressNo,
            data.bankName || null,
            data.bankBranch || null,
            data.accountName || null,
            data.accountNumber || null,
            userId
        ]);

        console.log('✅ Farmer profile updated, affected rows:', result.affectedRows);

        // Update contact details in users table
        const [userResult] = await conn.query(`
            UPDATE users
            SET
                email = ?,
                phone_number = ?
            WHERE id = ?
        `, [
            data.email,
            data.contactNumber,
            userId
        ]);

        console.log('✅ User contact updated, affected rows:', userResult.affectedRows);

        await conn.commit();
        console.log('✅ Transaction committed successfully');

    } catch (err) {
        await conn.rollback();
        console.error('❌ Error updating farmer profile:', err);
        throw err;
    } finally {
        conn.release();
    }
};