import db from "./database/config.js";

// Get all crop types from database
export const getAllCropTypes = async () => {
    try {
        console.log('🔹 Fetching all crop types from database...');

        const [rows] = await db.query(`
            SELECT crop_id, crop_name
            FROM crops_types
            ORDER BY crop_name ASC
        `);

        console.log(`✅ Fetched ${rows.length} crop types`);
        return rows;
    } catch (error) {
        console.error('❌ Error fetching crop types:', error);
        throw error;
    }
};

// CREATE new crop listing
// CREATE listing
export const createCropListing = async ({ userId, cropId, quantity, price, availableFrom }) => {
    try {
        console.log('🔹 Creating crop listing for userId:', userId);

        // Now use userId directly as farmer_id
        const [result] = await db.query(`
            INSERT INTO crop_listings
                (farmer_id, crop_id, quantity, price, available_from)
            VALUES (?, ?, ?, ?, ?)
        `, [userId, cropId, quantity, price, availableFrom]);

        console.log('✅ Crop listing created with ID:', result.insertId);

        return { success: true, listingId: result.insertId };
    } catch (error) {
        console.error('❌ Error creating crop listing:', error);
        throw new Error('Failed to create crop listing');
    }
};



// Get all active crop listings for a specific user
export const getFarmerCropListings = async (userId) => {
    try {
        console.log('🔹 Fetching crop listings for user:', userId);

        const [rows] = await db.query(`
            SELECT
                cl.id,
                cl.quantity,
                cl.price,
                cl.available_from,
                ct.crop_name,
                ct.crop_id,
                fp.farm_name,
                l.province,
                l.district,
                l.city,
                l.area
            FROM crop_listings cl
                     JOIN crops_types ct ON cl.crop_id = ct.crop_id
                     JOIN farmer_profiles fp ON cl.farmer_id = fp.user_id
                     JOIN locations l ON fp.location_id = l.id
            WHERE cl.farmer_id = ?
            ORDER BY cl.available_from DESC
        `, [userId]);

        console.log(`✅ Fetched ${rows.length} crop listings`);
        return rows;
    } catch (error) {
        console.error('❌ Error fetching crop listings:', error);
        throw new Error('Failed to fetch crop listings');
    }
};


// DELETE crop listing
export const deleteCropListing = async (listingId, userId) => {
    try {
        console.log('🔹 Deleting crop listing:', listingId, 'for userId:', userId);

        const [result] = await db.query(`
            DELETE FROM crop_listings
            WHERE id = ? AND farmer_id = ?
        `, [listingId, userId]);

        if (result.affectedRows === 0) {
            throw new Error('Listing not found or unauthorized');
        }

        console.log('✅ Crop listing deleted');
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting crop listing:', error);
        throw new Error('Failed to delete crop listing');
    }
};


// UPDATE crop listing
export const updateCropListing = async (listingId, userId, data) => {
    try {
        console.log('🔹 Updating crop listing:', listingId);

        const [result] = await db.query(`
            UPDATE crop_listings
            SET quantity = ?, price = ?, available_from = ?
            WHERE id = ? AND farmer_id = ?
        `, [data.quantity, data.price, data.availableFrom, listingId, userId]);

        if (result.affectedRows === 0) {
            throw new Error('Listing not found or unauthorized');
        }

        console.log('✅ Crop listing updated');
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating crop listing:', error);
        throw new Error('Failed to update crop listing');
    }
};

