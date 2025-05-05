import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import videofile from "../Models/videofile.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export const uploadvideo = async (req, res) => {
    if (req.file === undefined) {
        return res.status(404).json({ message: "Please upload a video file (mp4 only)." });
    }

    try {
        const originalVideoPath = req.file.path;
        const originalVideoSize = req.file.size;

        // Step 1: Save video metadata without qualities first to get MongoDB ID
        const file = new videofile({
            videotitle: req.body.title,
            filename: req.file.originalname,
            filepath: originalVideoPath,
            filetype: req.file.mimetype,
            filesize: originalVideoSize,
            videochanel: req.body.chanel,
            uploader: req.body.uploader,
            videoQualities: [] // Add later
        });

        await file.save(); // Save to get the _id
        const videoId = file._id.toString();

        // Step 2: Create folder if not exists
        const videoQualitiesFolder = path.join(__dirname, "..", "uploads", "qualities");
        if (!fs.existsSync(videoQualitiesFolder)) {
            fs.mkdirSync(videoQualitiesFolder, { recursive: true });
        }

        // Step 3: Define qualities and helper
        const qualities = [
            { quality: "1080p", bitRate: "1500k", size: "1920x1080" },
            { quality: "720p", bitRate: "1000k", size: "1280x720" },
            { quality: "480p", bitRate: "500k", size: "854x480" },
            { quality: "320p", bitRate: "300k", size: "640x360" },
        ];

        const generateVideoQuality = (quality, outputPath) => {
            return new Promise((resolve, reject) => {
                ffmpeg(originalVideoPath)
                    .output(outputPath)
                    .videoCodec("libx264")
                    .audioCodec("aac")
                    .videoBitrate(quality.bitRate)
                    .size(quality.size)
                    .on("end", () => resolve(outputPath))
                    .on("error", reject)
                    .run();
            });
        };

        // Step 4: Generate all qualities
        const videoQualities = [];
        for (let q of qualities) {
            const outputPath = path.join(videoQualitiesFolder, `${videoId}-${q.quality}.mp4`);

            try {
                await generateVideoQuality(q, outputPath);

                videoQualities.push({
                    quality: q.quality,
                    path: `/uploads/qualities/${videoId}-${q.quality}.mp4`,
                    filesize: fs.statSync(outputPath).size,
                });
            } catch (error) {
                console.error(`Error generating ${q.quality} video: `, error);
            }
        }

        // Step 5: Update DB with quality info
        file.videoQualities = videoQualities;
        await file.save();

        res.status(200).json({
            message: "Video uploaded and processed successfully.",
            videoId: videoId
        });

    } catch (error) {
        console.error("Error processing video upload: ", error);
        res.status(500).json({ message: error.message });
    }
};



export const getallvideos=async(req,res)=>{
    try {
        const files=await videofile.find();
        res.status(200).send(files)
    } catch (error) {
        res.status(404).json(error.message)
            return
    }
}

export const deleteVideoById = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await videofile.findById(id);

        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // Delete original file
        if (fs.existsSync(video.filepath)) {
            fs.unlinkSync(video.filepath);
        }

        // Delete all quality files
        if (video.videoQualities && Array.isArray(video.videoQualities)) {
            video.videoQualities.forEach((q) => {
                if (q.path && fs.existsSync(q.path)) {
                    fs.unlinkSync(q.path);
                }
            });
        }

        // Delete from database
        await videofile.findByIdAndDelete(id);

        res.status(200).json({ message: "Video deleted successfully." });
    } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ message: "Failed to delete video.", error: error.message });
    }
};
