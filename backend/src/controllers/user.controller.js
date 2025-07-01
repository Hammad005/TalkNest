import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    // Find users who have sent a friend request to the current user
    const incomingRequests = await FriendRequest.find({
      recipient: currentUserId,
      status: "pending",
    }).select("sender");

    const usersWhoSentRequest = incomingRequests.map(req => req.sender.toString());

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { _id: { $nin: currentUser.friends } }, // Exclude friends
        { _id: { $nin: usersWhoSentRequest } }, // Exclude users who sent request to current user
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic  nativeLanguage learningLanguage"
      );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    // Check if the current user is trying to send a friend request to themselves
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ error: "You cannot send a friend request to yourself." });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient user not found." });
    }

    // Check if the recipient has already sent a friend request to the current user
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ error: "You are already friends with this user." });
    }

    // check if a frined request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "A friend request already exists between you and this user.",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }
    

    //verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        error: "You are not authorized to accept this friend request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user to the other's friend list
    //$addToSet: adds the value only if it doesn't already exist
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const incomingRequest = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic  nativeLanguage learningLanguage"
    );

    const acceptedRequest = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({
      incomingRequest,
      acceptedRequest,
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getOutgoingFriendReqs = async (req, res) => {
  try {
    const outgoingRequest = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic  nativeLanguage learningLanguage"
    );
    res.status(200).json({
      outgoingRequest,
    });
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
