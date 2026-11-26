

using System;
using System.Text.RegularExpressions;

namespace school_management_Backend.Services
{
    public static class YouTubeService
    {
        private static readonly string[] UrlPatterns = new[]
        {
            @"(?:youtube\.com/watch\?v=)([\w-]{11})",
            @"(?:youtu\.be/)([\w-]{11})",
            @"(?:youtube\.com/shorts/)([\w-]{11})",
            @"(?:youtube\.com/embed/)([\w-]{11})",
            @"(?:youtube\.com/v/)([\w-]{11})"
        };

        public static string ExtractVideoId(string youtubeUrl)
        {
            if (string.IsNullOrWhiteSpace(youtubeUrl))
                return null;

            foreach (var pattern in UrlPatterns)
            {
                var match = Regex.Match(youtubeUrl, pattern);
                if (match.Success)
                    return match.Groups[1].Value;
            }

            return null;
        }

        public static string GetEmbedUrl(string videoId)
        {
            return string.IsNullOrWhiteSpace(videoId) ? null : $"https://www.youtube.com/embed/{videoId}";
        }

        public static string GetThumbnailUrl(string videoId)
        {
            return string.IsNullOrWhiteSpace(videoId) ? null : $"https://img.youtube.com/vi/{videoId}/maxresdefault.jpg";
        }

        public static bool IsValidYouTubeUrl(string youtubeUrl)
        {
            return !string.IsNullOrWhiteSpace(ExtractVideoId(youtubeUrl));
        }
    }
}
