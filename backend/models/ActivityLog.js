import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    action: { type: String, required: true }, // "Updated", "Deleted", etc.
    changes: { type: Object }, // Stores previous and new values
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("ActivityLog", ActivityLogSchema);
