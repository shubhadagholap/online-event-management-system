// Speaker controller stubs to prevent undefined callbacks

exports.getAllSpeakers = (req, res) => res.status(200).json({ speakers: [] });
exports.getSpeakerById = (req, res) => res.status(200).json({});
exports.getSpeakerAvailability = (req, res) => res.status(200).json({ availability: [] });

exports.createSpeaker = (req, res) => res.status(201).json({});
exports.updateSpeaker = (req, res) => res.status(200).json({});
exports.deleteSpeaker = (req, res) => res.status(200).json({});

exports.getSpeakerPresentations = (req, res) => res.status(200).json({ presentations: [] });
exports.createPresentation = (req, res) => res.status(201).json({});
exports.updatePresentationStatus = (req, res) => res.status(200).json({});

exports.getSpeakerAnalytics = (req, res) => res.status(200).json({ analytics: {} });
exports.updateSpeakerRating = (req, res) => res.status(200).json({});
