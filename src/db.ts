import mongoose, {model,Schema} from "mongoose"

const objectId= mongoose.Types.ObjectId;





const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type : {type:String,required:true},
    company: { type: String, required: true },
    location: { type: String, required: true },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    deadline: { type: String },
  },
  {
    timestamps: true,
  }
);

export const JobModel  = model("Job", JobSchema);
