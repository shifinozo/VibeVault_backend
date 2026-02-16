import { playlistModel } from "../Models/playlistModel.js";


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

        if (playlist.songs.includes(songid)) {
            return res.status(400).json({ message: "Song already exists" })
        }

        playlist.songs.push(songid)
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