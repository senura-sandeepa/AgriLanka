import express from "express";
import cors from "cors";
import {
    getFarmerProfile,
    updateFarmerProfile
} from "./services/FarmerProfileService.js";

import { createUserWithProfile } from "./services/signupService.js";

import {
    createCropListing, updateCropListing, getFarmerCropListings, deleteCropListing, getAllCropTypes
} from "./services/Croplistingservice.js";

import locationRouter from "./services/locationService.js";

const app = express();
app.use(cors());
app.use(express.json());

//_____________________________________ users sign up _______________________

app.post("/api/users", async (req, res) => {
    try {
        const {
            uid,
            name,
            email,
            phone,
            location,
            userType,
            ownerName,
            addressNo
        } = req.body;

        console.log('📥 Received signup request:', {
            uid,
            name,
            email,
            phone,
            location,
            userType,
            ownerName: ownerName || 'not provided',
            addressNo: addressNo || 'not provided'
        });

        if (!uid || !name || !email || !phone || !location || !userType) {
            return res.status(400).json({
                message: "Missing required fields",
                error: "uid, name, email, phone, location, and userType are required"
            });
        }

        if (userType === 'farmer') {
            if (!ownerName || !addressNo) {
                return res.status(400).json({
                    message: "Missing farmer-specific fields",
                    error: "ownerName and addressNo are required for farmers"
                });
            }
        }

        const result = await createUserWithProfile({
            uid,
            name,
            email,
            phone,
            location: Number(location),
            userType,
            ownerName: ownerName || null,
            addressNo: addressNo || null
        });

        console.log('✅ User created successfully:', result);

        res.json({
            message: "User saved successfully",
            userId: result.userId
        });

    } catch (e) {
        console.error("❌ Error saving user:", e);
        res.status(500).json({
            message: "Failed to save user",
            error: e.message
        });
    }
});

//_______________________________________ farmer profile ______________________

app.get("/api/farmer-profile/:userId", async (req, res) => {
    try {
        const profile = await getFarmerProfile(req.params.userId);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (e) {
        console.error("Error fetching profile:", e);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});

app.put("/api/farmer-profile/:userId", async (req, res) => {
    try {
        await updateFarmerProfile(req.params.userId, req.body);
        res.json({ message: "Profile updated successfully" });
    } catch (e) {
        console.error("Error updating profile:", e);
        res.status(500).json({ message: "Profile update failed" });
    }
});

//_________________________________ Crop Types & Listings ______________________

// Get all crop types
app.get("/api/crop-types", async (req, res) => {
    try {
        const cropTypes = await getAllCropTypes();
        res.json(cropTypes);
    } catch (e) {
        console.error("Error fetching crop types:", e);
        res.status(500).json({ message: "Failed to fetch crop types" });
    }
});

// Create new crop listing
app.post("/api/crop-listings", async (req, res) => {
    try {
        const { userId, cropId, quantity, price, availableFrom } = req.body;

        const result = await createCropListing({
            userId,   // pass userId directly
            cropId,
            quantity,
            price,
            availableFrom
        });

        res.json({
            message: "Crop listing created successfully",
            listingId: result.listingId
        });
    } catch (e) {
        console.error("❌ Error creating crop listing:", e);
        res.status(500).json({
            message: "Failed to create crop listing",
            error: e.message
        });
    }
});

// Get farmer's crop listings
app.get("/api/crop-listings/farmer/:userId", async (req, res) => {
    try {
        const listings = await getFarmerCropListings(req.params.userId); // pass userId directly
        res.json(listings);
    } catch (e) {
        console.error("❌ Error fetching crop listings:", e);
        res.status(500).json({ message: "Failed to fetch crop listings" });
    }
});

// Delete crop listing
app.delete("/api/crop-listings/:listingId", async (req, res) => {
    try {
        const { userId } = req.body;

        await deleteCropListing(req.params.listingId, userId); // pass userId directly
        res.json({ message: "Crop listing deleted successfully" });
    } catch (e) {
        console.error("❌ Error deleting crop listing:", e);
        res.status(500).json({ message: "Failed to delete crop listing" });
    }
});

// Update crop listing
app.put("/api/crop-listings/:listingId", async (req, res) => {
    try {
        const { userId, quantity, price, availableFrom } = req.body;

        await updateCropListing(req.params.listingId, userId, { // pass userId directly
            quantity,
            price,
            availableFrom
        });

        res.json({ message: "Crop listing updated successfully" });
    } catch (e) {
        console.error("❌ Error updating crop listing:", e);
        res.status(500).json({ message: "Failed to update crop listing" });
    }
});


//_____________________________________ locations ______________________________

app.use("/api", locationRouter);



// Get purchase goals for supermarket
app.get("/api/purchase-goals/:userId", async (req, res) => {
    try {
        const [rows] = await (await import('./services/database/config.js')).default.execute(
            `SELECT pg.* FROM purchase_goals pg
             JOIN supermarket_profiles sp ON pg.supermarket_id = sp.id
             WHERE sp.user_id = ?`,
            [req.params.userId]
        );
        res.json(rows);
    } catch (e) {
        console.error("Error fetching goals:", e);
        res.status(500).json({ message: "Failed to fetch goals" });
    }
});

// Add purchase goal
app.post("/api/purchase-goals", async (req, res) => {
    try {
        const { userId, cropName, targetQuantity, targetPrice, unit } = req.body;
        const [sp] = await (await import('./services/database/config.js')).default.execute(
            `SELECT id FROM supermarket_profiles WHERE user_id = ?`, [userId]
        );
        if (!sp.length) return res.status(404).json({ message: "Supermarket not found" });
        await (await import('./services/database/config.js')).default.execute(
            `INSERT INTO purchase_goals (supermarket_id, crop_name, target_quantity, target_price, unit)
             VALUES (?, ?, ?, ?, ?)`,
            [sp[0].id, cropName, targetQuantity, targetPrice || null, unit || 'kg']
        );
        res.json({ message: "Goal added successfully" });
    } catch (e) {
        console.error("Error adding goal:", e);
        res.status(500).json({ message: "Failed to add goal" });
    }
});


// ---------------------- Start Server ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});