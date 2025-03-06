import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Employee", 
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    },
    changes: { 
        type: Object 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("ActivityLog", ActivityLogSchema);
