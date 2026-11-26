export const validateYouTubeUrl = (url) => {
    if (!url || !url.trim()) {
        return 'YouTube URL is required';
    }

    const trimmedUrl = url.trim();
    const patterns = [
        /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]{11}($|&)/,
        /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]{11}($|\?)/,
        /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]{11}($|\?)/,
        /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]{11}($|\?)/,
    ];

    for (const pattern of patterns) {
        if (pattern.test(trimmedUrl)) return '';
    }

    return 'Please enter a valid YouTube URL';
};

export const extractVideoId = (url) => {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
        /(?:youtu\.be\/)([\w-]{11})/,
        /(?:youtube\.com\/shorts\/)([\w-]{11})/,
        /(?:youtube\.com\/embed\/)([\w-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
};

export const validateLectureForm = (formData) => {
    const errors = {};

    if (!formData.title?.trim()) {
        errors.title = 'Lecture title is required';
    } else if (formData.title.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters';
    }

    const youtubeError = validateYouTubeUrl(formData.youtubeUrl);
    if (youtubeError) {
        errors.youtubeUrl = youtubeError;
    }

    if (!formData.classId) {
        errors.classId = 'Please select a class';
    }

    if (!formData.sectionIds || formData.sectionIds.length === 0) {
        errors.sections = 'Please select at least one section';
    }

    if (!formData.subjectId) {
        errors.subjectId = 'Please select a subject';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};