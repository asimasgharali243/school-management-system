// Services/HtmlToTextConverter.cs
using System.Text;
using System.Text.RegularExpressions;

namespace school_management_Backend.Services
{
    public static class HtmlToTextConverter
    {
        public static string ConvertHtmlToPlainText(string html, int maxLength = 0)
        {
            if (string.IsNullOrEmpty(html))
                return string.Empty;

            var result = Regex.Replace(html, @"<script[^>]*>.*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            result = Regex.Replace(result, @"<style[^>]*>.*?</style>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);
            result = Regex.Replace(result, @"</?(div|p|h[1-6]|li|tr|section|article)[^>]*>", "\n", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, @"<br\s*/?>", "\n", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, @"</?(b|strong)[^>]*>", "", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, @"</?(i|em)[^>]*>", "", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, @"<[^>]+>", "", RegexOptions.IgnoreCase);
            result = System.Net.WebUtility.HtmlDecode(result);
            result = Regex.Replace(result, @"\n\s*\n", "\n\n");
            result = result.Trim();
            
            if (maxLength > 0 && result.Length > maxLength)
                result = result.Substring(0, maxLength) + "...";
            
            return result;
        }

        public static string ExtractPreview(string html, int maxLength = 100)
        {
            var plainText = ConvertHtmlToPlainText(html);
            if (plainText.Length > maxLength)
                plainText = plainText.Substring(0, maxLength) + "...";
            return plainText;
        }
    }
}