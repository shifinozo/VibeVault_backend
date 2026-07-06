import mongoose from "mongoose";
import { playlistModel } from "../Models/playlistModel.js";
import { upsertExternalSong } from "./songController.js";


export const playlist = async (req, res) => {
    try {
        const addplaylist = await playlistModel.create({ title: req.body.title, owner: req.userId })
        console.log(addplaylist);

        return res.status(201).send({ message: "add successfully", data: addplaylist })

    } catch (error) {
        console.log("errooorr", error);

    }
}


export const getplaylist = async (req, res) => {
    try {
        // const getplaylist= await playlistModel.find()
        const getplaylist = await playlistModel.find({ owner: req.userId })
        console.log(getplaylist);

        return res.status(201).send({ message: "all playlist get successfully", playlistdata: getplaylist })

    } catch (error) {
        console.log("erroorrr", error);

    }
}

export const getIDplaylist = async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await playlistModel
            .findById(id)
            .populate("songs")

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).json({
            message: "Playlist fetched successfully",
            data: playlist,
        });

    } catch (error) {
        console.error("error", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const findandupdateplaylist = async (req, res) => {
    try {

        const { id, songid } = req.params
        const userId = req.userId

        const playlist = await playlistModel.findOne({
            _id: id,
            owner: userId,
        })
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        let resolvedSongId = songid

        if (!mongoose.Types.ObjectId.isValid(songid)) {
            // External track (e.g. Jamendo, Audius) - not a real songModel
            // document yet, so get-or-create a local record and reference that instead.
            const { title, artist, filePath, imagePath } = req.body
            if (!title || !artist || !filePath) {
                return res.status(400).json({ message: "Missing track details for external song" })
            }
            const localSong = await upsertExternalSong({ externalId: songid, title, artist, filePath, imagePath })
            resolvedSongId = localSong._id.toString()
        }

        if (playlist.songs.includes(resolvedSongId)) {
            return res.status(400).json({ message: "Song already exists" })
        }

        playlist.songs.push(resolvedSongId)
        await playlist.save()


        return res.status(201).send({ message: "added successfully", data: playlist })

    } catch (error) {
        console.log("erroorrr", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const findandremoveplaylist = async (req, res) => {
    try {
        const { id, songid } = req.params
        console.log("playlist id  :", id);

        console.log("song id  :", songid);

        const findremoveplaylists = await playlistModel.findByIdAndUpdate(
            id,
            { $pull: { songs: songid } },
            { new: true }
        )


        console.log(findremoveplaylists);

        return res.status(201).send({ message: "delete successfully", data: findremoveplaylists })

    } catch (error) {
        console.log("erroorrr", error);
        res.status(500).json({ message: "Remove failed" })
    }
}

export const deleteplaylist = async (req, res) => {
    try {
        const { id } = req.params
        const deleteplaylist = await playlistModel.findByIdAndDelete(id)
        console.log(deleteplaylist);

        return res.status(201).send({ message: " playlist delete successfully", data: deleteplaylist })

    } catch (error) {
        console.log("erroorrr", error);

    }
}