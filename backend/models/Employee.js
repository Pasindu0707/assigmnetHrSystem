import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    job_title: { 
        type: String,
        required: true 
    },
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Department" 
    },
    status: { 
        type: String, 
        enum: ["Active", "Inactive"], 
        default: "Active"
    },
    profilePicture: { 
        type: String,
        default: null 
    }
}, 
{ timestamps: true });

export default mongoose.model("Employee", EmployeeSchema);
