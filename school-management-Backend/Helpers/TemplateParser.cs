using Newtonsoft.Json;

namespace school_management_Backend.Helpers
{
    public static class TemplateParser
    {
        public static string ParseTemplate(string template, Dictionary<string, object> data)
        {
            if (string.IsNullOrEmpty(template))
                return string.Empty;

            var result = template;

            foreach (var item in data)
            {
                var placeholder = "{" + item.Key + "}";
                var value = item.Value?.ToString() ?? string.Empty;
                result = result.Replace(placeholder, value);
            }

            return result;
        }

        public static string ParseJsonTemplate(string jsonTemplate, Dictionary<string, object> data)
        {
            if (string.IsNullOrEmpty(jsonTemplate))
                return null;

            try
            {
                var templateObj = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonTemplate);
                if (templateObj == null)
                    return null;

                foreach (var key in templateObj.Keys.ToList())
                {
                    if (templateObj[key] is string stringValue)
                    {
                        templateObj[key] = ParseTemplate(stringValue, data);
                    }
                }

                return JsonConvert.SerializeObject(templateObj);
            }
            catch
            {
                return jsonTemplate;
            }
        }

        public static Dictionary<string, string> ExtractPlaceholders(string template)
        {
            var placeholders = new Dictionary<string, string>();
            
            if (string.IsNullOrEmpty(template))
                return placeholders;

            var matches = System.Text.RegularExpressions.Regex.Matches(template, @"\{(\w+)\}");
            
            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                if (match.Groups.Count > 1)
                {
                    var placeholder = match.Groups[1].Value;
                    if (!placeholders.ContainsKey(placeholder))
                    {
                        placeholders[placeholder] = $"{{{placeholder}}}";
                    }
                }
            }

            return placeholders;
        }
    }
}