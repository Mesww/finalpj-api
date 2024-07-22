import express, { Request, Response } from "express";
import Activity from "../models/activity_model";
import Station from "../models/station_model";
import { getStations } from "../controllers/station_controllers";


const router = express.Router();


// Post request to add a Activity
router.post("/activity", async (req: Request, res: Response) => {
  try {
    // Validate incoming data (optional but recommended)
    const { studentid, location, marker, time,route } = req.body; // Destructure body properties
    // Create a new Todo instance using the validated data
    const newActivity = new Activity({ studentid, location, marker, time,route });
    // Save the new Todo to the database
    await newActivity.save();
    // Respond with success and the created Todo
    return res.status(201).json({ data: newActivity }); // Use status 201 for created entities
  } catch (error) {
    console.error("Error adding Activity:", error);
    return res.status(500).json({ error: "Internal server error." }); // Handle errors gracefully
  }
});




//Get request
router.get("/", async (req: Request, res: Response) => {
  try {
   
    res.status(200).json({
      data: "Hello",
    });
  } catch (err) {
    console.log("Error something" + err)
  }
});


// get station
router.get('/getStation', getStations);





export default router;
export { router }